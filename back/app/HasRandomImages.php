<?php

namespace App;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Pest\Support\Str;

trait HasRandomImages
{
    protected function getRandomImages($sourceDirectory, $targetPath = null)
    {
        $images = File::files(public_path($sourceDirectory));
        $randomImage = $images[array_rand($images)];

        if (!$targetPath) {
            return $sourceDirectory . '/' . $randomImage->getFilename();
        }
        $filename = uniqid() . '.' . $randomImage->getExtension();
        Storage::putFileAs($targetPath, $randomImage->getPathname(), $filename);
        // return str_replace('public/',"",$targetPath);
        return Str::after($targetPath, 'public/') . '/' . $filename;
    }
}
