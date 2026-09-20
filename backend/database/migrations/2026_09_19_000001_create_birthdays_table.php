<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('birthdays', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 120);
            $table->unsignedTinyInteger('jalali_day');
            $table->unsignedTinyInteger('jalali_month');
            $table->unsignedSmallInteger('jalali_year')->nullable();
            $table->string('group_name', 80)->default('عمومی');
            $table->text('note')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'jalali_month', 'jalali_day']);
            $table->index(['user_id', 'is_favorite']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('birthdays');
    }
};
