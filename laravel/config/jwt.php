<?php
return [
    'secret' => env('JWT_SECRET', 'white-dental-jwt-secret-2026'),
    'ttl' => (int) env('JWT_TTL', 10080),
    'algo' => 'HS256',
    'required_claims' => ['iss', 'iat', 'exp', 'nbf', 'sub', 'jti'],
];
