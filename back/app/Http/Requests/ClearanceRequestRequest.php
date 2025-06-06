<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClearanceRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'year' => 'required|string',
            'semester' => 'required|string',
            'section' => 'nullable|string',
            'academic_year' => 'required|string',
            'last_day_class_attended' => 'required|date',
            'reason_for_clearance' => 'required|string',
            'cafe_status' => 'required|in:cafe,non-cafe',
            'dorm_status' => 'required|in:dorm,non-dorm',
            'sex' => 'required|string'
        ];
    }
}
