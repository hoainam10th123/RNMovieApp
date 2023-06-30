using MovieAI.Entities;
using System.Text.Json.Serialization;

namespace MovieAI.Dtos
{
    public class PopularMovies
    {
        [JsonPropertyName("page")]
        public int Page { get; set; }

        [JsonPropertyName("results")]
        public List<Movie> Results { get; set; } = new List<Movie>();

        [JsonPropertyName("total_pages")]
        public int TotalPages { get; set; }

        [JsonPropertyName("total_results")]
        public int TotalResults { get; set; }
    }
}
