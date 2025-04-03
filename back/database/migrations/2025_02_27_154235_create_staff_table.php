<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('position');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('cascade')->change(); 
            $table->enum('role', ['department_head', 'library', 'cafeteria', 'proctor', 'registrar'])->after('position');
            $table->unique(['department_id', 'role'], 'unique_department_head')->where('role', 'department_head');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
