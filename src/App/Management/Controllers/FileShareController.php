<?php

namespace App\Mangement\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShareFilesRequest;
use App\Http\Resources\FileResource;
use App\Mail\ShareFilesMail;
use App\Models\FileShare;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Domain\File\Models\File;

class FileShareController extends Controller
{
}
