<?php

namespace Tests\Feature;

use Tests\TestCase;

class BirthdayAuthorizationTest extends TestCase
{
    public function test_birthdays_require_authentication(): void
    {
        $this->getJson('/api/v1/birthdays')
            ->assertUnauthorized();
    }
}
