<?php

namespace Domain\File\Controllers;

use App\Http\Controllers\Controller;
use Domain\File\Models\File;
use Domain\File\Models\StarredFile;
use Carbon\Carbon;
use Domain\File\DataTransferObjects\FilesActionData;
use Domain\File\DataTransferObjects\StoreFolderData;
use Domain\File\DataTransferObjects\StoreFileData;
use Domain\File\DataTransferObjects\AddToFavouritesData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileOperationsController extends Controller
{
    public function createFolder()
    {
    }

    public function store()
    {
    }

    public function destroy()
    {
    }

    // public function addToFavourites(AddToFavouritesRequestData $request)
    // {
    //     $data = $request->validated();

    //     $id = $data['id'];
    //     $file = File::find($id);
    //     $user_id = Auth::id();

    //     $starredFile = StarredFile::query()
    //         ->where('file_id', $file->id)
    //         ->where('user_id', $user_id)
    //         ->first();

    //     if ($starredFile) {
    //         $starredFile->delete();
    //     } else {
    //         StarredFile::create([
    //             'file_id' => $file->id,
    //             'user_id' => $user_id,
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //         ]);
    //     }
    // }

    // private function saveFileTree($fileTree, $parent, $user)
    // {
    //     foreach ($fileTree as $name => $file) {
    //         if (is_array($file)) {
    //             $folder = new File();
    //             $folder->is_folder = 1;
    //             $folder->name = $name;

    //             $parent->appendNode($folder);
    //             $this->saveFileTree($file, $folder, $user);
    //         } else {
    //             $this->saveFile($file, $user, $parent);
    //         }
    //     }
    // }

}
