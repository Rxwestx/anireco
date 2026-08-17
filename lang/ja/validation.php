<?php

return [

    /*
    |--------------------------------------------------------------------------
    | バリデーションメッセージ
    |--------------------------------------------------------------------------
    |
    | Laravelのバリデーションで使用するエラーメッセージです。
    |
    */

    'accepted' => ':attributeを承認してください。',
    'accepted_if' => ':otherが:valueの場合、:attributeを承認してください。',
    'active_url' => ':attributeには有効なURLを指定してください。',
    'after' => ':attributeには:dateより後の日付を指定してください。',
    'after_or_equal' => ':attributeには:date以降の日付を指定してください。',
    'alpha' => ':attributeには英字のみ使用できます。',
    'alpha_dash' => ':attributeには英数字、ダッシュ、アンダースコアのみ使用できます。',
    'alpha_num' => ':attributeには英数字のみ使用できます。',
    'any_of' => '選択された:attributeは正しくありません。',
    'array' => ':attributeは配列で指定してください。',
    'ascii' => ':attributeには半角英数字および記号のみ使用できます。',
    'before' => ':attributeには:dateより前の日付を指定してください。',
    'before_or_equal' => ':attributeには:date以前の日付を指定してください。',

    'between' => [
        'array' => ':attributeの項目数は:min個から:max個の間で指定してください。',
        'file' => ':attributeは:min KBから:max KBの間で指定してください。',
        'numeric' => ':attributeは:minから:maxの間で指定してください。',
        'string' => ':attributeは:min文字から:max文字の間で入力してください。',
    ],

    'boolean' => ':attributeにはtrueまたはfalseを指定してください。',
    'can' => ':attributeには許可されていない値が含まれています。',
    'confirmed' => ':attributeと確認用入力が一致しません。',
    'contains' => ':attributeに必要な値が含まれていません。',
    'current_password' => '現在のパスワードが正しくありません。',
    'date' => ':attributeには有効な日付を指定してください。',
    'date_equals' => ':attributeには:dateと同じ日付を指定してください。',
    'date_format' => ':attributeは:format形式で指定してください。',
    'decimal' => ':attributeは小数点以下:decimal桁で指定してください。',
    'declined' => ':attributeを拒否してください。',
    'declined_if' => ':otherが:valueの場合、:attributeを拒否してください。',
    'different' => ':attributeと:otherには異なる値を指定してください。',
    'digits' => ':attributeは:digits桁で指定してください。',
    'digits_between' => ':attributeは:min桁から:max桁の間で指定してください。',
    'dimensions' => ':attributeの画像サイズが正しくありません。',
    'distinct' => ':attributeに重複した値があります。',
    'doesnt_contain' => ':attributeには次の値を含めないでください: :values。',
    'doesnt_end_with' => ':attributeは次の値で終わらないようにしてください: :values。',
    'doesnt_start_with' => ':attributeは次の値で始まらないようにしてください: :values。',
    'email' => ':attributeには有効なメールアドレスを入力してください。',
    'encoding' => ':attributeは:encodingでエンコードしてください。',
    'ends_with' => ':attributeは次のいずれかで終わる必要があります: :values。',
    'enum' => '選択された:attributeは正しくありません。',
    'exists' => '選択された:attributeは正しくありません。',
    'extensions' => ':attributeには次のいずれかの拡張子を指定してください: :values。',
    'file' => ':attributeにはファイルを指定してください。',
    'filled' => ':attributeには値を入力してください。',

    'gt' => [
        'array' => ':attributeの項目数は:value個より多くしてください。',
        'file' => ':attributeは:value KBより大きくしてください。',
        'numeric' => ':attributeは:valueより大きい値を指定してください。',
        'string' => ':attributeは:value文字より長くしてください。',
    ],

    'gte' => [
        'array' => ':attributeの項目数は:value個以上にしてください。',
        'file' => ':attributeは:value KB以上にしてください。',
        'numeric' => ':attributeは:value以上の値を指定してください。',
        'string' => ':attributeは:value文字以上で入力してください。',
    ],

    'hex_color' => ':attributeには有効な16進数カラーコードを指定してください。',
    'image' => ':attributeには画像を指定してください。',
    'in' => '選択された:attributeは正しくありません。',
    'in_array' => ':attributeは:otherに存在する値を指定してください。',
    'in_array_keys' => ':attributeには次のキーのうち少なくとも1つを含めてください: :values。',
    'integer' => ':attributeには整数を指定してください。',
    'ip' => ':attributeには有効なIPアドレスを指定してください。',
    'ipv4' => ':attributeには有効なIPv4アドレスを指定してください。',
    'ipv6' => ':attributeには有効なIPv6アドレスを指定してください。',
    'json' => ':attributeには有効なJSON文字列を指定してください。',
    'list' => ':attributeにはリストを指定してください。',
    'lowercase' => ':attributeは小文字で入力してください。',

    'lt' => [
        'array' => ':attributeの項目数は:value個未満にしてください。',
        'file' => ':attributeは:value KB未満にしてください。',
        'numeric' => ':attributeは:value未満の値を指定してください。',
        'string' => ':attributeは:value文字未満で入力してください。',
    ],

    'lte' => [
        'array' => ':attributeの項目数は:value個以下にしてください。',
        'file' => ':attributeは:value KB以下にしてください。',
        'numeric' => ':attributeは:value以下の値を指定してください。',
        'string' => ':attributeは:value文字以下で入力してください。',
    ],

    'mac_address' => ':attributeには有効なMACアドレスを指定してください。',

    'max' => [
        'array' => ':attributeの項目数は:max個以下にしてください。',
        'file' => ':attributeは:max KB以下にしてください。',
        'numeric' => ':attributeは:max以下の値を指定してください。',
        'string' => ':attributeは:max文字以下で入力してください。',
    ],

    'max_digits' => ':attributeは:max桁以下で指定してください。',
    'mimes' => ':attributeには次の形式のファイルを指定してください: :values。',
    'mimetypes' => ':attributeには次のMIMEタイプのファイルを指定してください: :values。',

    'min' => [
        'array' => ':attributeの項目数は:min個以上にしてください。',
        'file' => ':attributeは:min KB以上にしてください。',
        'numeric' => ':attributeは:min以上の値を指定してください。',
        'string' => ':attributeは:min文字以上で入力してください。',
    ],

    'min_digits' => ':attributeは:min桁以上で指定してください。',
    'missing' => ':attributeは指定しないでください。',
    'missing_if' => ':otherが:valueの場合、:attributeは指定しないでください。',
    'missing_unless' => ':otherが:valueでない場合、:attributeは指定しないでください。',
    'missing_with' => ':valuesが存在する場合、:attributeは指定しないでください。',
    'missing_with_all' => ':valuesがすべて存在する場合、:attributeは指定しないでください。',
    'multiple_of' => ':attributeには:valueの倍数を指定してください。',
    'not_in' => '選択された:attributeは正しくありません。',
    'not_regex' => ':attributeの形式が正しくありません。',
    'numeric' => ':attributeには数値を指定してください。',

    'password' => [
        'letters' => ':attributeには英字を1文字以上含めてください。',
        'mixed' => ':attributeには大文字と小文字をそれぞれ1文字以上含めてください。',
        'numbers' => ':attributeには数字を1文字以上含めてください。',
        'symbols' => ':attributeには記号を1文字以上含めてください。',
        'uncompromised' => 'この:attributeは過去の情報漏えいで使用された可能性があります。別の:attributeを使用してください。',
    ],

    'present' => ':attributeを指定してください。',
    'present_if' => ':otherが:valueの場合、:attributeを指定してください。',
    'present_unless' => ':otherが:valueでない場合、:attributeを指定してください。',
    'present_with' => ':valuesが存在する場合、:attributeを指定してください。',
    'present_with_all' => ':valuesがすべて存在する場合、:attributeを指定してください。',
    'prohibited' => ':attributeは入力できません。',
    'prohibited_if' => ':otherが:valueの場合、:attributeは入力できません。',
    'prohibited_if_accepted' => ':otherが承認されている場合、:attributeは入力できません。',
    'prohibited_if_declined' => ':otherが拒否されている場合、:attributeは入力できません。',
    'prohibited_unless' => ':otherが:valuesのいずれかでない場合、:attributeは入力できません。',
    'prohibits' => ':attributeが指定されている場合、:otherは指定できません。',
    'regex' => ':attributeの形式が正しくありません。',
    'required' => ':attributeは必須です。',
    'required_array_keys' => ':attributeには次の項目を含めてください: :values。',
    'required_if' => ':otherが:valueの場合、:attributeは必須です。',
    'required_if_accepted' => ':otherが承認されている場合、:attributeは必須です。',
    'required_if_declined' => ':otherが拒否されている場合、:attributeは必須です。',
    'required_unless' => ':otherが:valuesのいずれかでない場合、:attributeは必須です。',
    'required_with' => ':valuesが存在する場合、:attributeは必須です。',
    'required_with_all' => ':valuesがすべて存在する場合、:attributeは必須です。',
    'required_without' => ':valuesが存在しない場合、:attributeは必須です。',
    'required_without_all' => ':valuesがすべて存在しない場合、:attributeは必須です。',
    'same' => ':attributeと:otherは同じ値を指定してください。',

    'size' => [
        'array' => ':attributeの項目数は:size個にしてください。',
        'file' => ':attributeは:size KBにしてください。',
        'numeric' => ':attributeは:sizeを指定してください。',
        'string' => ':attributeは:size文字で入力してください。',
    ],

    'starts_with' => ':attributeは次のいずれかで始まる必要があります: :values。',
    'string' => ':attributeは文字列で入力してください。',
    'timezone' => ':attributeには有効なタイムゾーンを指定してください。',
    'unique' => 'この:attributeはすでに使用されています。',
    'uploaded' => ':attributeのアップロードに失敗しました。',
    'uppercase' => ':attributeは大文字で入力してください。',
    'url' => ':attributeには有効なURLを指定してください。',
    'ulid' => ':attributeには有効なULIDを指定してください。',
    'uuid' => ':attributeには有効なUUIDを指定してください。',

    /*
    |--------------------------------------------------------------------------
    | カスタムバリデーションメッセージ
    |--------------------------------------------------------------------------
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | 項目名
    |--------------------------------------------------------------------------
    |
    | :attribute に表示される項目名を日本語へ置き換えます。
    |
    */

    'attributes' => [
        'name' => 'ユーザー名',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'password_confirmation' => 'パスワード確認',
    ],

];