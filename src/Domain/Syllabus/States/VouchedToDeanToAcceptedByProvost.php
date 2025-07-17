<?php

namespace Domain\Syllabus\States;

use Domain\Syllabus\Models\Syllabus;
use Spatie\ModelStates\Transition;

class VouchedToDeanToAcceptedByProvost extends Transition
{


    private Syllabus $syllabus;

    private string $message;

    public function __construct(Syllabus $syllabus, string $message)
    {
        $this->syllabus = $syllabus;

        $this->message = $message;
    }
    public function handle(): Syllabus
    {
        $this->syllabus->status = new AcceptedByProvost($this->syllabus);
        $this->syllabus->failed_at = now();
        $this->syllabus->error_message = $this->message;

        $this->syllabus->save();

        return $this->syllabus;
    }
}
