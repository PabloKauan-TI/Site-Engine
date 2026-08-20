<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->json('areas')->nullable();
            $table->string('email')->unique();
            $table->text('biografia')->nullable();
            $table->string('funcao')->nullable();
            $table->string('formacao')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('lattes')->nullable();
            $table->string('url_foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
