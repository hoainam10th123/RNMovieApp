using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ML;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using MovieAI.DataStructures;
using MovieAI.Entities;
using System.Data.SqlClient;

namespace MovieAI.Services
{
    /// <summary>
    /// https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/movie-recommendation
    /// </summary>
    public interface IRecommendationEngine
    {
        void BuildAndTrainModel();
        Movie? Prediction(Movie movie, int userId);
    }

    /// <summary>
    /// Algorithm - Matrix Factorization
    /// </summary>
    public class RecommendationService : IRecommendationEngine
    {
        private static string ModelPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ModelTraining.zip");
        private readonly IConfiguration _config;
        private MLContext _mlContext;
        private readonly PredictionEnginePool<DataStructures.MovieRating, MovieRatingPrediction> _predictionEnginePool;
        public RecommendationService(IConfiguration config, PredictionEnginePool<DataStructures.MovieRating, MovieRatingPrediction> predictionEnginePool)
        {
            //STEP 1: Create MLContext to be shared across the model creation workflow objects 
            _mlContext = new MLContext();
            _config = config;
            _predictionEnginePool = predictionEnginePool;
        }

        public void BuildAndTrainModel()
        {
            //STEP 2: Read the training data which will be used to train the movie recommendation model
            string commandText = "SELECT UserId as userId, MovieId as movieId, Rating as Label from MovieRatings";

            DatabaseLoader loader = _mlContext.Data.CreateDatabaseLoader<DataStructures.MovieRating>();

            DatabaseSource dbSource = new DatabaseSource(SqlClientFactory.Instance, _config.GetConnectionString("DefaultConnection"), commandText);

            IDataView trainingDataView = loader.Load(dbSource);
            //STEP 3: Transform your data by encoding the two features userId and movieID. These encoded features will be provided as input
            //        to our MatrixFactorizationTrainer.
            var dataProcessingPipeline = _mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: "userIdEncoded", inputColumnName: nameof(DataStructures.MovieRating.userId))
                           .Append(_mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: "movieIdEncoded", inputColumnName: nameof(DataStructures.MovieRating.movieId)));

            //Specify the options for MatrixFactorization trainer            
            MatrixFactorizationTrainer.Options options = new MatrixFactorizationTrainer.Options();
            options.MatrixColumnIndexColumnName = "userIdEncoded";
            options.MatrixRowIndexColumnName = "movieIdEncoded";
            options.LabelColumnName = "Label";
            options.NumberOfIterations = 20;
            options.ApproximationRank = 100;

            //STEP 4: Create the training pipeline 
            var trainingPipeLine = dataProcessingPipeline.Append(_mlContext.Recommendation().Trainers.MatrixFactorization(options));

            //STEP 5: Train the model fitting to the DataSet
            Console.WriteLine("=============== Training the model ===============");
            ITransformer model = trainingPipeLine.Fit(trainingDataView);

            //STEP 6: Evaluate the model performance 
            Console.WriteLine("=============== Evaluating the model ===============");

            var TestDataLocation = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "recommendation-ratings-test.csv");
            IDataView testDataView = _mlContext.Data.LoadFromTextFile<DataStructures.MovieRating>(TestDataLocation, hasHeader: true, separatorChar: ',');
            var prediction = model.Transform(testDataView);
            var metrics = _mlContext.Regression.Evaluate(prediction, labelColumnName: "Label", scoreColumnName: "Score");
            Console.WriteLine("The model evaluation metrics RootMeanSquaredError:" + metrics.RootMeanSquaredError);

            //STEP 7:  Try/test a single prediction by predicting a single movie rating for a specific user
            var predictionengine = _mlContext.Model.CreatePredictionEngine<DataStructures.MovieRating, MovieRatingPrediction>(model);
            /* Make a single movie rating prediction, the scores are for a particular user and will range from 1 - 5. 
               The higher the score the higher the likelyhood of a user liking a particular movie.
               You can recommend a movie to a user if say rating > 3.5.*/
            var predictionuserId = 1; var predictionmovieId = 9980;
            var movieratingprediction = predictionengine.Predict(
                new DataStructures.MovieRating()
                {
                    userId = predictionuserId,
                    movieId = predictionmovieId
                }
            );
            Console.WriteLine("For userId:" + predictionuserId + " movie rating prediction (1 - 5 stars) for movie:" + " is:" + Math.Round(movieratingprediction.Score, 1));
            _mlContext.Model.Save(model, trainingDataView.Schema, ModelPath);
        }

        public Movie? Prediction(Movie movie, int userId)
        {
            var inputData = new DataStructures.MovieRating
            {
                userId = userId,
                movieId = movie.Id,
            };

            //Define DataViewSchema for data preparation pipeline and trained model
            //DataViewSchema modelSchema;
            // Load trained model
            /* co the su dung cach tren nay
             * ITransformer trainedModel = _mlContext.Model.Load(ModelPath, out modelSchema);
            var predictionengine = _mlContext.Model.CreatePredictionEngine<DataStructures.MovieRating, MovieRatingPrediction>(trainedModel);
            var movieratingprediction = predictionengine.Predict(inputData);*/

            MovieRatingPrediction prediction = _predictionEnginePool.Predict(inputData);

            //score tuong duong rating, truong hop nay chi can rating >= 3 la movie do user quan tam
            if (Math.Round(prediction.Score, 1) >= 3)
            {
                //Console.WriteLine("Movie " + inputData.movieId + " is recommended for user " + inputData.userId);
                return movie;
            }
            else
            {
                //Console.WriteLine("Movie " + inputData.movieId + " is not recommended for user " + inputData.userId);
                return null;
            }
        }
    }
}
