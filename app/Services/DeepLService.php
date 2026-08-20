<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Throwable;

class DeepLService
{
    public function translateToJapanese(?string $text): string
    {
        if (blank($text)) {
            return '';
        }

            try {
                $response = Http::timeout(10)
                ->withHeaders([
                    'Authorization' =>
                        'DeepL-Auth-Key ' . config('services.deepl.auth_key'),
                ])->post(
                    config('services.deepl.base_url') . '/v2/translate',
                    [
                        'text' => [$text],
                        'target_lang' => 'JA', // ここでターゲット言語を指定
                    ],
                );

            $response->throw();

            return $response->json(
            'translations.0.text',$text);
        } catch (Throwable $e) {
            Log::error('DeepL translation failed', [
                'message' => $e->getMessage(),
            ]);
            return $text;
        }
    }

    public function translateManyToJapanese(array $texts): array
    {
        if ($texts === []) {
            return [];
        }

        $results = [];
        $textsToTranslate = [];
        $uncachedIndexes = [];

        foreach ($texts as $index => $text) {
            if (blank($text)) {
                $results[$index] = '';
                continue;
            }

            $cacheKey = 'deepl.genre.' . md5($text);
            $cached = Cache::get($cacheKey);

            if ($cached !== null) {
                $results[$index] = $cached;
                continue;
            }
                $textsToTranslate[] = $text;
                $uncachedIndexes[] = $index;
        }

        if ($textsToTranslate !== []) {
            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Authorization' =>
                            'DeepL-Auth-Key ' . config('services.deepl.auth_key'),
                    ])->post(
                    config('services.deepl.base_url') . '/v2/translate',
                    [
                        'text' => $textsToTranslate,
                        'target_lang' => 'JA',
                    ],
                );

                $response->throw();

                $translations = $response->json('translations',[]);

                foreach ($translations as $key => $translation) {
                    $index = $uncachedIndexes[$key];

                    $translatedText = $translation['text']
                        ?? $texts[$index];

                    $results[$index] = $translatedText;

                    Cache::forever(
                        'deepl.genre.' . md5($texts[$index]),
                        $translatedText,
                    );
                }
            } catch (Throwable $e) {
                Log::error('DeepL genre translation failed', [
                    'message' => $e->getMessage(),
                ]);

                foreach ($uncachedIndexes as $index) {
                    $results[$index] = $texts[$index];
                }
            }
        }
        ksort($results);

        return array_values($results);
    }
}
