<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrashFilesRequest;
use App\Http\Resources\FileResource;
use Domain\File\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrashController extends Controller
{
    public function index()
    {
    }

    public function restore()
    {
    }

    public function deleteForever()
    {
    }
}
