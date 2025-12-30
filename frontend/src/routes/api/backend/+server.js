import {FILE_UPLOAD_URL} from '$env/static/private';

export async function POST({request}) {
    
    const result = {
                "personal_info": {
                    "name": "Prudvi Raju Borra",
                    "title": "Data Scientist",
                    "contact": {
                        "email": "borraprudviraju@gmail.com",
                        "phone": "+91-9182604309",
                        "linkedin": "https://www.linkedin.com/in/praveen-allam69/",
                        "github": "Github",
                        "website": null,
                        "location": "Hyderabad"
                    },
                    "bio": "Experienced Data Scientist specializing in machine learning and generative AI solutions, with a strong background in automation, predictive modeling, and building intelligent systems using LLMs."
                },
                "summary": "Worked on machine learning and generative AI solutions for business problems, and used python for tasks like PII data masking and automation of application servers admin tasks.",
                "experience": [
                    {
                        "company": "Hitachi Digital Systems",
                        "role": "Data Scientist",
                        "start_date": "Jul 2021",
                        "end_date": "Present",
                        "is_current": true,
                        "location": "Hyderabad",
                        "highlights": [
                            "Developed an intelligent troubleshooting assistant for application server admins using LLMs and LangGraph to automate common diagnostic tasks.",
                            "Enabled faster and consistent issue resolution, reducing manual effort for support teams by automating routine investigation steps.",
                            "Built a Resume-RAG system for internal talent matching using LangGraph, ChromaDB, and Azure OpenAI.",
                            "Improved profile to requirement matching efficiency for the RMG team, enabling faster and more accurate talent identification.",
                            "Developed a telecom churn prediction model using Decision Trees, XGBoost, and LightGBM; achieved 94% recall.",
                            "Analyzed key factors behind customer churn using SHAP values, providing actionable and explainable insights to business teams.",
                            "Reduced churn by 9%, segmenting customers with decile and lift charts to target high-risk segments."
                        ]
                    }
                ],
                "education": [
                    {
                        "institution": "Scaler",
                        "degree": "Specialization in Data Science & Machine Learning",
                        "start_date": null,
                        "end_date": "2024",
                        "grade": null
                    },
                    {
                        "institution": "Gayatri Vidya Parishad College of Engineering",
                        "degree": "BE/B.Tech/BS in Information Technology",
                        "start_date": null,
                        "end_date": "2021",
                        "grade": "7.96 CGPA"
                    }
                ],
                "projects": [
                    {
                        "name": "Data Analysis & Business Insights",
                        "description": "Performed detailed exploratory data analysis (EDA) on business case studies to derive actionable insights for decision-making.",
                        "tech_stack": [
                            "Python",
                            "SQL",
                            "Statistical Hypothesis Testing"
                        ],
                        "key_points": [
                            "Applied statistical hypothesis testing (Z-test, T-test, ANOVA, chi-square) to validate assumptions about data.",
                            "Implemented standardization and encoding techniques for preparing data for reporting and model building.",
                            "Handled outliers and missing data to clean and transform datasets."
                        ],
                        "url": "https://github.com/prudviraju10/data_analysis/tree/main",
                        "image_url": null
                    },
                    {
                        "name": "Delivery Time Estimation",
                        "description": "Estimated delivery times for a food delivery app, achieving a MAPE of 6%.",
                        "tech_stack": [
                            "Keras",
                            "Adam optimizer",
                            "Optuna",
                            "Batch normalization"
                        ],
                        "key_points": [
                            "Analyzed data to pinpoint peak order times and effectively manage outliers.",
                            "Developed a Sequential Keras model utilizing Optuna for hyperparameter tuning and regularization for generalization."
                        ],
                        "url": "https://drive.google.com/file/d/1qPcLUGU7scwIANvCzWlYe_OVRKaordRa/view?usp=sharing",
                        "image_url": null
                    },
                    {
                        "name": "AI-Powered Chatbot",
                        "description": "Built a three-page AI app using Streamlit, integrating Llama 3.3 70b model and agentic tools.",
                        "tech_stack": [
                            "Streamlit",
                            "Llama 3.3 70b",
                            "Groq API",
                            "LangChain",
                            "Langgraph",
                            "ChromaDB",
                            "Google embeddings"
                        ],
                        "key_points": [
                            "Designed chatbots with generic Q&A, RAG capabilities, and AI agents with tools.",
                            "Utilized Google embeddings for semantic search and enhanced response accuracy.",
                            "Used wikipedia and search tools to provide the LLM with additional knowledge sources."
                        ],
                        "url": "https://aillmdemoapp.streamlit.app/",
                        "image_url": null
                    },
                    {
                        "name": "Movie Recommender System",
                        "description": "Developed a personalized movie recommender system using collaborative filtering.",
                        "tech_stack": [
                            "Pearson Correlation",
                            "Cosine Similarity",
                            "Matrix Factorization"
                        ],
                        "key_points": [
                            "Used user-based and item-based collaborative filtering to enhance user engagement.",
                            "Applied matrix factorization to handle sparse user-item matrices, improving prediction accuracy."
                        ],
                        "url": "https://github.com/prudviraju10/recommender_system",
                        "image_url": null
                    }
                ],
                "skills": [
                    {
                        "category_name": "Technical Skills",
                        "skills": [
                            "Python",
                            "SQL",
                            "NumPy",
                            "Pandas",
                            "Scikit-learn",
                            "TensorFlow",
                            "FastAPI",
                            "Data Analysis",
                            "Clustering",
                            "Recommender Systems",
                            "Time Series Forecasting",
                            "Bagging & Boosting",
                            "DL",
                            "NLP",
                            "Transformers",
                            "Gen AI",
                            "Langgraph",
                            "AWS : EC2, ECS, ECR",
                            "Docker",
                            "MLOps"
                        ]
                    }
                ],
                "certifications": [
                    "AI Agents (HuggingFace)",
                    "Python & SQL (HackerRank)",
                    "Geospatial Analysis (Kaggle)"
                ],
                "publications": [],
                "languages": [],
                "awards": [],
                "interests": []
            };
    return new Response(JSON.stringify({message: 'File uploaded successfully', data: result}), {status: 200});
}

export async function GET() {
    const response = await fetch(FILE_UPLOAD_URL + '/status');
    if (!response.ok) {
        return new Response(JSON.stringify({error: 'Failed to reach backend service'}), {status: 500});
    }
    return new Response(JSON.stringify({message: 'Backend API is running'}), {status: 200});
}