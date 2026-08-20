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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->json('areas')->nullable();
            $table->string('subtitulo')->nullable();
            $table->text('descricao')->nullable();
            $table->text('objetivos')->nullable();
            $table->string('tecnologias')->nullable();
            $table->integer('ano_inicio')->nullable();
            $table->integer('ano_fim')->nullable();
            $table->string('financiamento')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
