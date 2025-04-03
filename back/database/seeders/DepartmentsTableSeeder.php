<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentsTableSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            ['department' => 'Agricultural Economics', 'college' => 'College of Agriculture, Food, Environment and Climate Science'],
            ['department' => 'Animal Science', 'college' => 'College of Agriculture, Food, Environment and Climate Science'],
            ['department' => 'Horticulture', 'college' => 'College of Agriculture, Food, Environment and Climate Science'],
            ['department' => 'Natural Resources Management', 'college' => 'College of Agriculture, Food, Environment and Climate Science'],
            ['department' => 'Plant Sciences', 'college' => 'College of Agriculture, Food, Environment and Climate Science'],
            ['department' => 'Forestry and Climate Science', 'college' => 'College of Agriculture, Food, Environment and Climate Science'],

            ['department' => 'Accounting and Finance', 'college' => 'College of Business and Economics'],
            ['department' => 'Economics', 'college' => 'College of Business and Economics'],
            ['department' => 'Marketing Management', 'college' => 'College of Business and Economics'],
            ['department' => 'Management', 'college' => 'College of Business and Economics'],
            ['department' => 'Hotel and Tourism Management', 'college' => 'College of Business and Economics'],

            ['department' => 'Educational Planning and Management', 'college' => 'College of Education and Behavioral Science'],
            ['department' => 'Psychology', 'college' => 'College of Education and Behavioral Science'],
            ['department' => 'Early Childhood and Care Education', 'college' => 'College of Education and Behavioral Science'],
            ['department' => 'Special Needs and Inclusive Education', 'college' => 'College of Education and Behavioral Science'],

            ['department' => 'Civil Engineering', 'college' => 'College of Engineering and Technology'],
            ['department' => 'Computer Science', 'college' => 'College of Engineering and Technology'],
            ['department' => 'Electrical and Computer Engineering', 'college' => 'College of Engineering and Technology'],
            ['department' => 'Hydraulics and Water Resources Engineering', 'college' => 'College of Engineering and Technology'],
            ['department' => 'Information Systems', 'college' => 'College of Engineering and Technology'],
            ['department' => 'Information Technology', 'college' => 'College of Engineering and Technology'],
            ['department' => 'Software Engineering', 'college' => 'College of Engineering and Technology'],

            ['department' => 'Anesthesia', 'college' => 'College of Medicine and Health Science'],
            ['department' => 'Midwifery', 'college' => 'College of Medicine and Health Science'],
            ['department' => 'Nursing', 'college' => 'College of Medicine and Health Science'],
            ['department' => 'Pharmacy', 'college' => 'College of Medicine and Health Science'],
            ['department' => 'Public Health', 'college' => 'College of Medicine and Health Science'],
            ['department' => 'Veterinary Medicine', 'college' => 'College of Medicine and Health Science'],

            ['department' => 'Architecture', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Geology', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Statistics', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Biochemistry', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Biotechnology', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Environmental Science', 'college' => 'College of Natural and Computational Science'],

            ['department' => 'Mathematics', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Physics', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Chemistry', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Biology', 'college' => 'College of Natural and Computational Science'],
            ['department' => 'Sport Science', 'college' => 'College of Natural and Computational Science'],

            ['department' => 'English Language and Literature', 'college' => 'College of Social Science and Humanities'],
            ['department' => 'Geography and Environmental Studies', 'college' => 'College of Social Science and Humanities'],
            ['department' => 'History', 'college' => 'College of Social Science and Humanities'],
            ['department' => 'Sociology', 'college' => 'College of Social Science and Humanities'],

            ['department' => 'Law', 'college' => 'School of Law'],
        ];

        DB::table('departments')->insert($departments);
    }
}

