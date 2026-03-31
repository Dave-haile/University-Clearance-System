<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add indexes that support the most common dashboard, queue,
     * and student clearance lookup patterns.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->index('role', 'users_role_idx');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->index('college', 'departments_college_idx');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->index(['department_id', 'year'], 'students_department_year_idx');
            $table->index(['user_id', 'department_id'], 'students_user_department_idx');
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->index(['role', 'department_id'], 'staff_role_department_idx');
        });

        Schema::table('clearance_requests', function (Blueprint $table) {
            $table->index(
                ['student_id', 'archived', 'created_at'],
                'clearance_requests_student_archived_created_idx'
            );

            $table->index(
                ['department_id', 'archived', 'current_step', 'status'],
                'clearance_requests_department_archived_step_status_idx'
            );

            $table->index(
                ['archived', 'status'],
                'clearance_requests_archived_status_idx'
            );

            $table->index(
                ['archived', 'created_at'],
                'clearance_requests_archived_created_idx'
            );
        });
    }

    /**
     * Drop the performance indexes added in this migration.
     */
    public function down(): void
    {
        Schema::table('clearance_requests', function (Blueprint $table) {
            $table->dropIndex('clearance_requests_student_archived_created_idx');
            $table->dropIndex('clearance_requests_department_archived_step_status_idx');
            $table->dropIndex('clearance_requests_archived_status_idx');
            $table->dropIndex('clearance_requests_archived_created_idx');
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->dropIndex('staff_role_department_idx');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex('students_department_year_idx');
            $table->dropIndex('students_user_department_idx');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->dropIndex('departments_college_idx');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_idx');
        });
    }
};
