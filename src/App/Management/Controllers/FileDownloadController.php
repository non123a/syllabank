<?php

namespace App\File\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\FilesActionRequest;
use Domain\File\Models\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileDownloadController extends Controller
{
    public function download()
    {
        // $parent = $request->parent;

        // $all = $data['all'] ?? false;
        // $ids = $data['ids'] ?? [];

        // if (!$all && empty($ids)) {
        //     return [
        //         'message' => 'Please select files to download'
        //     ];
        // }

        // if ($all) {
        //     $url = $this->createZip($parent->children);
        //     $filename = $parent->name . '.zip';
        // } else {
        //     [$url, $filename] = $this->getDownloadUrl($ids, $parent->name);
        // }

        // return [
        //     'url' => $url,
        //     'filename' => $filename
        // ];
    }

    public function downloadSharedWithMe()
    {

        // $all = $data['all'] ?? false;
        // $ids = $data['ids'] ?? [];

        // if (!$all && empty($ids)) {
        //     return [
        //         'message' => 'Please select files to download'
        //     ];
        // }

        // $zipName = 'shared_with_me';
        // if ($all) {
        //     $files = File::getSharedWithMe()->get();
        //     $url = $this->createZip($files);
        //     $filename = $zipName . '.zip';
        // } else {
        //     [$url, $filename] = $this->getDownloadUrl($ids, $zipName);
        // }

        // return [
        //     'url' => $url,
        //     'filename' => $filename
        // ];
    }
}
