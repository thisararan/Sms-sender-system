<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    if (!Schema::hasColumn('contacts', 'group')) {
        DB::statement('ALTER TABLE contacts ADD COLUMN "group" VARCHAR(100) DEFAULT "General"');
        echo " Group column added successfully\n";
    } else {
        echo " Group column already exists\n";
    }
    
    // Verify columns
    $columns = Schema::getColumnListing('contacts');
    echo "Columns: " . implode(', ', $columns) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
