#[Cacheable]
public function getStatistics($podcast)
{
    return $podcast->analyze();
}