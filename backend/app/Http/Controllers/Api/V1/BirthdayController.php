<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBirthdayRequest;
use App\Http\Resources\BirthdayResource;
use App\Models\Birthday;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class BirthdayController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return BirthdayResource::collection(
            $request->user()->birthdays()
                ->latest('jalali_month')
                ->latest('jalali_day')
                ->paginate(25)
        );
    }

    public function store(StoreBirthdayRequest $request): JsonResponse
    {
        $birthday = $request->user()->birthdays()->create($request->validated());

        return (new BirthdayResource($birthday))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Request $request, Birthday $birthday): BirthdayResource
    {
        $this->ensureOwner($request, $birthday);

        return new BirthdayResource($birthday);
    }

    public function update(StoreBirthdayRequest $request, Birthday $birthday): BirthdayResource
    {
        $this->ensureOwner($request, $birthday);
        $birthday->update($request->validated());

        return new BirthdayResource($birthday->refresh());
    }

    public function destroy(Request $request, Birthday $birthday): Response
    {
        $this->ensureOwner($request, $birthday);
        $birthday->delete();

        return response()->noContent();
    }

    private function ensureOwner(Request $request, Birthday $birthday): void
    {
        abort_unless($birthday->user_id === $request->user()->id, Response::HTTP_NOT_FOUND);
    }
}
