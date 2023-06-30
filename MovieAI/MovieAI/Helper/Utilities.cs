namespace MovieAI.Helper
{
    public class Utilities
    {
        public const string SEED_DATA_MOVIES = "DATA_MOVIES";
        public const string PRIDICTION_MODEL = "PRIDICTION_MODEL";
        public const string BUILD_TRAINING_MODEL = "BUILD_TRAINING_MODEL";
        public static string CreateMd5PasswordHash(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                return Convert.ToHexString(hashBytes);
            }
        }

        /// <summary>
        /// random float from 1.0 to 5.0
        /// </summary>
        /// <returns></returns>
        public static float NextFloat()
        {
            Random random = new Random();
            float randomNumber = (float)(random.NextDouble() * 4) + 1.0f;
            var giaTri = Math.Round(randomNumber, 1);
            return (float)giaTri;
        }
    }
}
