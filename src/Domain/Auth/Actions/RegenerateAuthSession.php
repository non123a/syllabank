<?php

namespace Domain\Auth\Actions;

use Illuminate\Http\Request;

class RegenerateAuthSession
{
    public function __construct(private Request $request)
    {
    }

    public function execute()
    {
        $this->request->session()->regenerate();
    }
}
