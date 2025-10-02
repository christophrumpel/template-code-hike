public function getStatistics($podcast)
{
    return Cache::remember(
        'podcast-statistics',
        60,
        fn() => $podcast->analyze();
    );
}