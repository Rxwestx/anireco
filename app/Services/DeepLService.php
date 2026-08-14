<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DeepLService
{
    public function translate(string $text): string
    {
        if ($text === '') {
            return '';
        }

        $response = Http::withHeaders([
            'Authorization' => 'DeepL-Auth-Key '
                . config('services.deepl.auth_key'),
        ])->post(
            config('services.deepl.base_url') . '/v2/translate',
            [
            'text' => $text,
            'target_lang' => 'JA', // ここでターゲット言語を指定
            ],
        );

        return $response->json('translations.0.text');
    }
}
