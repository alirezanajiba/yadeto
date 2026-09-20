<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiHealthTest extends TestCase
{
    public function test_api_health_endpoint_is_available(): void
    {
        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertJson([
                'status' => 'ok',
                'service' => 'yadeto-api',
                'version' => '2.2.2',
            ]);
    }
}
