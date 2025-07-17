<?php

namespace App\Http\Controllers;

use App\Services\SyllabiReminderService;
use Illuminate\Http\Request;

class SyllabiReminderController extends Controller
{
    protected $syllabiReminderService;

    public function __construct(SyllabiReminderService $syllabiReminderService)
    {
        $this->syllabiReminderService = $syllabiReminderService;
    }

    public function sendReminders(Request $request)
    {
        $threshold = $request->input('threshold', 14);
        $result = $this->syllabiReminderService->sendReminders($threshold);
        return response()->json($result);
    }
}