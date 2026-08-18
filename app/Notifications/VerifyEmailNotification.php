<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
             Carbon::now()->addMinutes(
                Config::get('auth.verification.expire', 60)
            ),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1(
                    $notifiable->getEmailForVerification(),
                ),
            ],
        );

        return (new MailMessage)
            ->subject('【AniReco】メールアドレス認証のお願い')
            ->greeting('こんにちは。')
            ->line('AniRecoへご登録いただきありがとうございます。')
            ->line('下のボタンをクリックして、メールアドレスの認証を完了してください。')
            ->action('メールアドレスを認証', $verificationUrl)
            ->line('このメールに心当たりがない場合は、このメールを破棄してください。')
            ->salutation('AniReco');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
