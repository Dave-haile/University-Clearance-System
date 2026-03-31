<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class ApiCacheService
{
    /**
     * Remember a value using versioned cache groups.
     *
     * @param  array<int, string>  $groups
     */
    public function remember(array $groups, string $suffix, int $ttlSeconds, callable $callback): mixed
    {
        $cacheKey = $this->key($groups, $suffix);

        return Cache::remember($cacheKey, now()->addSeconds($ttlSeconds), $callback);
    }

    /**
     * Remember a request-based value using query params as part of the cache signature.
     *
     * @param  array<int, string>  $groups
     */
    public function rememberRequest(array $groups, Request $request, int $ttlSeconds, callable $callback, ?string $prefix = null): mixed
    {
        $suffix = trim(($prefix ? $prefix.':' : '').$this->requestSignature($request), ':');

        return $this->remember($groups, $suffix, $ttlSeconds, $callback);
    }

    /**
     * Increment the version for one or more cache groups.
     *
     * @param  array<int, string>|string  $groups
     */
    public function bump(array|string $groups): void
    {
        foreach (Arr::wrap($groups) as $group) {
            $versionKey = $this->versionKey($group);

            if (! Cache::has($versionKey)) {
                Cache::forever($versionKey, 1);
            }

            Cache::increment($versionKey);
        }
    }

    /**
     * Build a stable request signature from the request path and query params.
     */
    public function requestSignature(Request $request): string
    {
        $query = $request->query();
        ksort($query);

        return sha1(json_encode([
            'path' => $request->path(),
            'query' => $query,
        ]));
    }

    /**
     * Build the final cache key.
     *
     * @param  array<int, string>  $groups
     */
    public function key(array $groups, string $suffix): string
    {
        $versions = [];

        foreach ($groups as $group) {
            $versions[$group] = $this->version($group);
        }

        return 'api_cache:'.md5(json_encode([
            'groups' => $versions,
            'suffix' => $suffix,
        ]));
    }

    /**
     * Get the current version for a cache group.
     */
    public function version(string $group): int
    {
        return (int) Cache::get($this->versionKey($group), 1);
    }

    /**
     * Build the version key for a cache group.
     */
    protected function versionKey(string $group): string
    {
        return 'api_cache_group_version:'.$group;
    }
}
