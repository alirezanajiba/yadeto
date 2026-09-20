<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBirthdayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'jalali_day' => ['required', 'integer', 'between:1,31'],
            'jalali_month' => ['required', 'integer', 'between:1,12'],
            'jalali_year' => ['nullable', 'integer', 'between:1200,1500'],
            'group_name' => ['required', 'string', 'max:80'],
            'note' => ['nullable', 'string', 'max:2000'],
            'is_favorite' => ['sometimes', 'boolean'],
        ];
    }
}
