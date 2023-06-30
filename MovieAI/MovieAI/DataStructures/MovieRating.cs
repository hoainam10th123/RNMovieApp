
using Microsoft.ML.Data;

namespace MovieAI.DataStructures
{
    public class MovieRating
    {
        [LoadColumn(0)]
        public int userId;
        [LoadColumn(1)]
        public int movieId;
        [LoadColumn(2)]
        public float Label; // du doan rating cua movie nen rating la label
    }
}
