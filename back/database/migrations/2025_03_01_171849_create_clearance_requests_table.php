<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clearance_requests', function (Blueprint $table) {
            $table->id();
            $table->string('student_id');
            $table->string('sex');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->json('approvals')->nullable();
            $table->string('year');
            $table->string('semester');
            $table->string('section');
            $table->string('department');
            $table->string('college');
            $table->string('academic_year');
            $table->date('last_day_class_attended');
            $table->text('reason_for_clearance');
            $table->enum('cafe_status', ['cafe', 'non-cafe']);
            $table->enum('dorm_status', ['dorm', 'non-dorm'])->default('dorm');
            $table->enum('current_step', ['department_head', 'library', 'cafeteria', 'proctor', 'registrar','all_approved'])->default('department_head');
            $table->boolean('department_head_approved')->default(null)->nullable();
            $table->boolean('library_approved')->default(null)->nullable();
            $table->boolean('cafeteria_approved')->default(null)->nullable();
            $table->boolean('proctor_approved')->default(null)->nullable();
            $table->boolean('registrar_approved')->default(null)->nullable();
            $table->boolean('archived')->default(false);
            $table->timestamps();
            
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clearance_requests');
    }
};
