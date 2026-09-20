<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'date' => [
                'day' => $this->jalali_day,
                'month' => $this->jalali_month,
                'year' => $this->jalali_year,
            ],
            'group' => $this->group_name,
            'note' => $this->note,
            'is_favorite' => $this->is_favorite,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
