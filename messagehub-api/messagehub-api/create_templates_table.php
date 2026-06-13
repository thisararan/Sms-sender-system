<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    if (!Schema::hasTable('message_templates')) {
        Schema::create('message_templates', function ($table) {
            $table->id();
            $table->string('name');
            $table->longText('content');
            $table->string('category')->default('General');
            $table->json('variables')->nullable();
            $table->timestamps();
        });
        echo "? message_templates table created\n";
    } else {
        echo " message_templates table already exists\n";
    }
    
    // Check columns
    $columns = Schema::getColumnListing('message_templates');
    echo "Columns: " . implode(', ', $columns) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
