<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('date_format_dd_mm_yyyy', function ($attribute, $value, $parameters, $validator) {
            // Validar el formato de fecha "DD/MM/YYYY"
            $format = 'd/m/Y';
            $date = \DateTime::createFromFormat($format, $value);

            // Verificar si la fecha es válida y si cumple con el formato exacto
            return $date && $date->format($format) === $value;
        });
    }
}
