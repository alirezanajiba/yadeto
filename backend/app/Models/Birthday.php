<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Birthday extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'jalali_day',
        'jalali_month',
        'jalali_year',
        'group_name',
        'note',
        'is_favorite',
    ];

    protected function casts(): array
    {
        return [
            'jalali_day' => 'integer',
            'jalali_month' => 'integer',
            'jalali_year' => 'integer',
            'is_favorite' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
