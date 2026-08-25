import { s, type SkillDef } from "../types";

export const ML_AI: SkillDef[] = [
  // ── Core Machine Learning & Statistical Learning ──
  s("machine-learning", "Machine Learning (ML)", "ml-core", ["ml", "applied machine learning", "supervised learning", "unsupervised learning", "semi-supervised learning", "statistical machine learning"], ["high-demand", "core"]),
  s("scikit-learn", "scikit-learn", "ml-library", ["sklearn", "scikit learn", "sci-kit learn", "sklearn python", "sklearn pipelines", "cross-validation sklearn"], ["high-demand", "core"]),
  s("xgboost", "XGBoost", "ml-library", ["xg boost", "extreme gradient boosting", "xgboost classifier", "xgboost regressor", "gradient boosted trees"], ["high-demand", "core"]),
  s("lightgbm", "LightGBM", "ml-library", ["light gbm", "microsoft lightgbm", "tree based learning"]),
  s("catboost", "CatBoost", "ml-library", ["cat boost", "yandex catboost", "categorical feature boosting"]),
  s("linear-regression", "Linear & Logistic Regression", "ml-algorithm", ["linear regression", "logistic regression", "generalized linear models", "glm", "ridge lasso elasticnet"]),
  s("decision-trees", "Decision Trees & Random Forests", "ml-algorithm", ["random forest", "extra trees", "cart algorithm", "ensemble learning"]),
  s("svm", "Support Vector Machines (SVM)", "ml-algorithm", ["svm", "support vector classifier", "kernel trick svm"]),
  s("clustering-algorithms", "Clustering Algorithms (K-Means / DBSCAN / HDBSCAN)", "ml-algorithm", ["k-means clustering", "dbscan", "hdbscan", "hierarchical clustering", "gaussian mixture models", "gmm"]),
  s("pca", "Dimensionality Reduction (PCA / t-SNE / UMAP)", "ml-algorithm", ["principal component analysis", "pca", "t-sne", "umap", "svd", "factor analysis"]),
  s("feature-engineering", "Feature Engineering & Preprocessing", "ml-technique", ["feature selection", "feature extraction", "one-hot encoding", "target encoding", "feature scaling", "handling missing data", "outlier detection"], ["high-demand", "core"]),
  s("feature-store", "Feature Store (Feast / Tecton)", "ml-ops", ["feast feature store", "tecton feature store", "online offline feature store", "feature serving"]),
  s("optuna", "Optuna Hyperparameter Optimization", "ml-tool", ["optuna", "hyperparameter tuning", "bayesian optimization", "hyperopt", "ray tune"]),

  // ── Deep Learning Frameworks & Architectures ──
  s("deep-learning", "Deep Learning (DL)", "dl-core", ["dl", "deep neural networks", "artificial neural networks", "ann", "backpropagation", "gradient descent", "activation functions"], ["high-demand", "core"]),
  s("pytorch", "PyTorch", "dl-framework", ["py torch", "pytorch framework", "meta pytorch", "torchvision", "torchaudio", "torchtext", "pytorch lightning", "torchscript", "libtorch", "pytorch 2.x"], ["high-demand", "core"]),
  s("pytorch-lightning", "PyTorch Lightning", "dl-framework", ["lightning ai", "pytorch-lightning", "lightning fabric"]),
  s("tensorflow", "TensorFlow", "dl-framework", ["tf", "tensorflow 2.x", "google tensorflow", "tf.keras", "tensorflow hub", "tf.data", "savedmodel"], ["high-demand", "core"]),
  s("keras", "Keras", "dl-framework", ["keras deep learning", "keras 3", "multi-backend keras", "keras sequential", "keras functional api"]),
  s("jax", "JAX", "dl-framework", ["google jax", "flax jax", "haiku jax", "jax transformations", "autograd jax", "xla compiler"], ["trending", "high-demand"]),
  s("transformers-architecture", "Transformer Neural Networks", "dl-architecture", ["transformer model", "self-attention mechanism", "multi-head attention", "encoder-decoder", "vision transformer vit", "flashattention", "rope positional embeddings"], ["high-demand", "core"]),
  s("cnn", "Convolutional Neural Networks (CNN)", "dl-architecture", ["cnn", "convnet", "resnet", "efficientnet", "yolo", "vgg", "u-net", "convolutional layers"]),
  s("rnn-lstm", "Recurrent Neural Networks & LSTMs", "dl-architecture", ["rnn", "lstm", "gru", "bidirectional lstm", "sequence modeling"]),
  s("gan", "Generative Adversarial Networks (GAN)", "dl-architecture", ["gans", "stylegan", "cyclegan", "dcgan", "adversarial training"]),
  s("diffusion-models", "Diffusion Models (DDPM / Stable Diffusion)", "dl-architecture", ["diffusion models", "latent diffusion", "stable diffusion", "denoising diffusion", "controlnet", "flux ai"]),
  s("autoencoders", "Autoencoders & VAEs", "dl-architecture", ["autoencoder", "variational autoencoder", "vae", "latent space representation"]),
  s("graph-neural-networks", "Graph Neural Networks (GNN)", "dl-architecture", ["gnn", "pyg", "pytorch geometric", "dgl", "deep graph library", "graph convolutional networks", "gcn", "gat"]),

  // ── Generative AI & Large Language Models (LLMs) ──
  s("generative-ai", "Generative AI", "genai-core", ["gen ai", "genai", "generative artificial intelligence", "generative models", "creative ai"], ["high-demand", "trending", "core"]),
  s("llm", "Large Language Models (LLMs)", "genai-core", ["llms", "large language model", "foundation models", "gpt-4", "gpt-4o", "claude 3.5 sonnet", "llama 3", "llama 3.3", "mistral", "gemini 1.5", "deepseek", "deepseek-r1", "deepseek-v3", "o1 reasoning", "o3 reasoning"], ["high-demand", "trending", "core"]),
  s("deepseek-models", "DeepSeek AI Models (V3 / R1 / MoE)", "genai-core", ["deepseek", "deepseek r1", "deepseek v3", "deepseek reasoning", "mixture of experts moe", "deepseek coder", "distilled r1"], ["trending", "high-demand"]),
  s("mcp-protocol", "Model Context Protocol (MCP)", "genai-framework", ["mcp", "model context protocol", "anthropic mcp", "mcp server", "mcp client", "mcp tools", "mcp resources", "context protocol"], ["trending", "high-demand"]),
  s("prompt-engineering", "Prompt Engineering & Prompt Optimization", "genai-technique", ["prompt design", "prompt crafting", "few-shot prompting", "chain-of-thought", "cot", "react prompting", "system prompts", "dspyprompt", "prompt caching"], ["trending", "high-demand"]),
  s("prompt-caching", "Prompt Caching & Context Optimization", "genai-technique", ["prompt caching", "anthropic prompt caching", "kv cache reuse", "prefix caching", "context window optimization"]),
  s("speculative-decoding", "Speculative Decoding & Fast Inference", "genai-technique", ["speculative decoding", "draft model inference", "medusa decoding", "speculative sampling"]),
  s("rag", "Retrieval-Augmented Generation (RAG)", "genai-technique", ["rag pipeline", "advanced rag", "hybrid search rag", "chunking strategies", "reranking rag", "hypothetical document embeddings hyde", "graph rag", "context window management", "corrective rag crag", "self-rag", "agentic rag"], ["high-demand", "trending", "core"]),
  s("fine-tuning", "LLM Fine-Tuning & Parameter-Efficient Fine-Tuning (PEFT)", "genai-technique", ["model fine tuning", "peft", "lora", "qlora", "low rank adaptation", "instruction tuning", "supervised fine-tuning sft", "axolotl", "unsloth", "torchtune"], ["high-demand", "trending"]),
  s("unsloth", "Unsloth (Fast LLM Fine-Tuning)", "genai-tool", ["unsloth", "unsloth ai", "fast lora fine-tuning", "memory efficient fine-tuning"]),
  s("axolotl-finetuning", "Axolotl (LLM Fine-Tuning Framework)", "genai-tool", ["axolotl", "axolotl ai", "multi-gpu sft lora"]),
  s("rlhf-dpo", "RLHF & Preference Alignment (DPO / KTO / ORPO)", "genai-technique", ["reinforcement learning from human feedback", "rlhf", "direct preference optimization", "dpo", "kto", "reward modeling", "trl trlx"]),
  s("model-quantization", "Model Quantization & Compression (GGUF / AWQ / GPTQ / EXL2)", "genai-technique", ["quantization", "gguf", "llama.cpp", "awq", "gptq", "bitsandbytes", "int4 int8 quantization", "ollama"]),
  s("embeddings", "Vector Embeddings & Semantic Search", "genai-technique", ["vector embeddings", "text embeddings", "openai embeddings", "bge embeddings", "cohere embeddings", "voyage ai", "sentence transformers", "cosine similarity", "dot product distance", "semantic search"], ["high-demand", "core"]),
  s("function-calling", "LLM Tool Use & Function Calling", "genai-technique", ["structured outputs", "tool calling llm", "openai function calling", "json mode llm", "instructor python"]),
  s("multimodal-ai", "Multimodal AI (Vision-Language Models)", "genai-technique", ["vlm", "multimodal models", "gpt-4v", "claude vision", "image reasoning", "audio language models", "video understanding ai"], ["trending", "high-demand"]),

  // ── Agentic AI & Multi-Agent Frameworks ──
  s("ai-agents", "AI Agents & Autonomous Systems", "ai-agents", ["agentic ai", "autonomous agents", "agent workflows", "tool-augmented agents", "self-reflective agents", "agent memory", "plan and execute agents"], ["trending", "high-demand", "core"]),
  s("langchain", "LangChain Framework", "genai-framework", ["lang chain", "langchain python", "langchain js", "langchain core", "langchain community", "langchain expression language", "lcel", "document loaders", "chains langchain"], ["high-demand", "trending", "core"]),
  s("langgraph", "LangGraph (Stateful Agent Orchestration)", "genai-framework", ["lang graph", "langgraph orchestration", "stategraph", "multi-agent langgraph", "human in the loop agents", "langgraph studio"], ["trending", "high-demand", "core"]),
  s("llamaindex", "LlamaIndex (Data Framework for LLMs)", "genai-framework", ["llama index", "llamaindex python", "llama hub", "llamaindex workflows", "data connectors llamaindex"], ["trending", "high-demand"]),
  s("crewai", "CrewAI (Multi-Agent Framework)", "genai-framework", ["crew ai", "crewai agents", "multi agent collaboration", "crewai tasks", "hierarchical crews"], ["trending", "high-demand"]),
  s("microsoft-autogen", "Microsoft AutoGen", "genai-framework", ["autogen", "autogen studio", "conversational multi-agent autogen", "autogen v0.4"]),
  s("semantic-kernel", "Microsoft Semantic Kernel", "genai-framework", ["semantic kernel c#", "semantic kernel python", "sk plugins", "planners semantic kernel"]),
  s("haystack", "Haystack (deepset)", "genai-framework", ["haystack nlp", "haystack 2.0", "haystack pipeline", "deepset ai"]),
  s("dspy", "DSPy (Programming Foundation Models)", "genai-framework", ["dspy framework", "stanford dspy", "declarative prompt programming", "dspy teleprompters", "bootstrapfewshot"]),

  // ── LLM APIs & Foundation Model Providers ──
  s("openai-api", "OpenAI API & Ecosystem", "llm-api", ["openai", "chatgpt api", "gpt-4o", "o1 reasoning model", "openai assistants api", "openai embeddings api", "dall-e 3", "whisper api"], ["high-demand", "core"]),
  s("anthropic-api", "Anthropic Claude API", "llm-api", ["anthropic", "claude 3.5 sonnet", "claude 3 opus", "claude 3 haiku", "claude api", "anthropic sdk", "computer use api"], ["high-demand", "trending"]),
  s("google-gemini-api", "Google Gemini API & Vertex AI", "llm-api", ["gemini api", "gemini 1.5 pro", "gemini 1.5 flash", "google ai studio", "vertex ai gemini"]),
  s("mistral-ai", "Mistral AI & Open Models", "llm-api", ["mistral", "mistral large", "mixtral 8x7b", "mixtral 8x22b", "mistral codestral", "mistral api"]),
  s("cohere-api", "Cohere API (Command / Embed / Rerank)", "llm-api", ["cohere", "cohere command r+", "cohere rerank", "cohere embed"]),
  s("groq", "Groq (LPU Inference Engine)", "llm-inference", ["groq api", "groq lpu", "ultra fast llm inference"]),
  s("together-ai", "Together AI", "llm-inference", ["together api", "together inference engine"]),
  s("replicate", "Replicate", "llm-inference", ["replicate.com", "replicate api", "hosted open source models"]),

  // ── Hugging Face & Model Hubs ──
  s("huggingface", "Hugging Face Ecosystem", "ml-platform", ["hf", "huggingface transformers", "huggingface datasets", "huggingface hub", "huggingface spaces", "huggingface tokenizers", "diffusers", "accelerate", "safetensors", "tgi text generation inference"], ["high-demand", "core"]),
  s("ollama", "Ollama (Local LLM Runtime)", "llm-runtime", ["ollama local", "ollama runner", "run llms locally", "ollama modelfile"], ["trending", "high-demand"]),
  s("vllm", "vLLM (High-Throughput LLM Serving)", "llm-serving", ["vllm serving", "pagedattention", "vllm inference server", "vllm openapi server"], ["trending", "high-demand"]),
  s("tgi", "Text Generation Inference (TGI)", "llm-serving", ["huggingface tgi", "tgi docker", "flashattention tgi"]),
  s("tensorrt-llm", "NVIDIA TensorRT-LLM", "llm-serving", ["tensorrt llm", "nvidia trt-llm", "optimized gpu llm inference"]),

  // ── MLOps, Tracking & LLM Observability ──
  s("mlflow", "MLflow", "mlops", ["ml flow", "mlflow tracking", "mlflow registry", "mlflow models", "mlflow recipes", "databricks mlflow"], ["high-demand", "core"]),
  s("wandb", "Weights & Biases (W&B)", "mlops", ["wandb", "weights and biases", "w&b experiment tracking", "weave wandb", "wandb sweeps", "artifacts wandb"], ["high-demand", "core"]),
  s("langfuse", "Langfuse (LLM Observability & Analytics)", "llm-observability", ["langfuse", "llm tracing langfuse", "prompt management langfuse", "evaluations langfuse", "open source langfuse"], ["trending", "high-demand", "core"]),
  s("langsmith", "LangSmith (LangChain Platform)", "llm-observability", ["langsmith", "langsmith evaluation", "langsmith tracing", "langchain testing platform"], ["trending", "high-demand"]),
  s("traceloop", "OpenLLMetry / Traceloop", "llm-observability", ["traceloop", "openllmetry", "opentelemetry for llms"]),
  s("arize-phoenix", "Arize Phoenix", "llm-observability", ["phoenix evals", "arize ai", "llm tracing phoenix"]),
  s("ragas", "Ragas (RAG Assessment Framework)", "llm-evaluation", ["ragas", "rag evaluation", "faithfulness metric", "answer relevance metric"]),
  s("deepeval", "DeepEval", "llm-evaluation", ["deep eval", "llm unit testing framework", "confident ai deepeval"]),
  s("kubeflow", "Kubeflow Pipelines & Platform", "mlops", ["kubeflow", "kfp", "kubeflow pipelines", "katib hyperparameter tuning", "kserve"]),
  s("kserve", "KServe (Model Serving on Kubernetes)", "mlops", ["kserve", "kfserving", "serverless model inference"]),
  s("bentoml", "BentoML", "ml-serving", ["bento ml", "bentoml 1.0", "openllm bentoml", "containerized model serving"]),
  s("seldon-core", "Seldon Core", "ml-serving", ["seldon", "seldon core v2", "enterprise model serving"]),
  s("triton-server", "NVIDIA Triton Inference Server", "ml-serving", ["triton inference server", "nvidia triton", "dynamic batching triton", "concurrent model execution"]),
  s("dvc", "DVC (Data Version Control)", "mlops", ["data version control", "dvc pipeline", "dvc storage s3"]),

  // ── Natural Language Processing (NLP) ──
  s("nlp", "Natural Language Processing (NLP)", "nlp-domain", ["natural language understanding", "nlu", "natural language generation", "nlg", "computational linguistics", "text analytics"], ["high-demand", "core"]),
  s("spacy", "spaCy", "nlp-library", ["spacy nlp", "spacy pipelines", "explosion ai spacy"]),
  s("nltk", "NLTK", "nlp-library", ["natural language toolkit", "nltk python"]),
  s("named-entity-recognition", "Named Entity Recognition (NER)", "nlp-task", ["ner", "entity extraction", "spacy ner", "bert ner"]),
  s("sentiment-analysis", "Sentiment Analysis & Text Classification", "nlp-task", ["sentiment classification", "opinion mining", "intent classification", "document classification"]),
  s("topic-modeling", "Topic Modeling (LDA / BERTopic)", "nlp-task", ["lda", "latent dirichlet allocation", "bertopic", "topic extraction"]),
  s("text-summarization", "Text Summarization", "nlp-task", ["abstractive summarization", "extractive summarization"]),
  s("machine-translation", "Machine Translation", "nlp-task", ["seq2seq translation", "neural machine translation nmt"]),

  // ── Computer Vision (CV) ──
  s("computer-vision", "Computer Vision (CV)", "cv-domain", ["computer vision ai", "image processing", "visual computing"], ["high-demand", "core"]),
  s("opencv", "OpenCV", "cv-library", ["open cv", "opencv python", "opencv c++", "cv2", "image filtering opencv"], ["high-demand", "core"]),
  s("object-detection", "Object Detection (YOLO / Faster R-CNN)", "cv-task", ["yolo", "yolov8", "yolov9", "yolov10", "yolov11", "faster r-cnn", "ssd", "bounding boxes", "real-time object detection"]),
  s("image-segmentation", "Image Segmentation (Semantic / Instance / Panoptic)", "cv-task", ["semantic segmentation", "instance segmentation", "mask r-cnn", "segment anything sam", "sam 2", "u-net segmentation"]),
  s("ocr", "Optical Character Recognition (OCR)", "cv-task", ["ocr", "tesseract ocr", "easyocr", "paddleocr", "text extraction from images"]),
  s("image-generation", "Image Generation & Inpainting", "cv-task", ["text to image", "inpainting", "outpainting", "controlnet image generation"]),
  s("face-recognition", "Facial Recognition & Biometrics", "cv-task", ["face detection", "facenet", "deepface", "facial landmark detection"]),
  s("pose-estimation", "Human Pose Estimation", "cv-task", ["pose estimation", "mediapipe", "openpose", "mmpose"]),
  s("albumentations", "Albumentations", "cv-library", ["image augmentation albumentations"]),

  // ── Audio, Speech & Multimodal Processing ──
  s("speech-recognition", "Speech Recognition (ASR / STT)", "audio-domain", ["automatic speech recognition", "asr", "speech to text", "stt", "openai whisper", "whisper large", "kaldi"]),
  s("text-to-speech", "Text-to-Speech (TTS)", "audio-domain", ["tts", "voice synthesis", "elevenlabs", "coqui tts", "bark tts", "vits"]),
  s("audio-processing", "Audio Processing & Feature Extraction", "audio-domain", ["librosa", "torchaudio", "spectrogram", "mfcc", "audio signal processing"]),
  s("voice-cloning", "Voice Cloning & Conversational Voice AI", "audio-domain", ["voice cloning", "conversational voice agents", "livekit voice agent", "vapi voice"]),

  // ── Reinforcement Learning & Optimization ──
  s("reinforcement-learning", "Reinforcement Learning (RL)", "rl-domain", ["rl", "deep reinforcement learning", "drl", "q-learning", "dqn", "policy gradients", "ppo", "proximal policy optimization", "actor critic", "markov decision processes mdp"]),
  s("gymnasium", "Gymnasium (OpenAI Gym)", "rl-library", ["openai gym", "gymnasium rl environment"]),
  s("stable-baselines3", "Stable-Baselines3", "rl-library", ["sb3", "stable baselines rl"]),
  s("ray-rllib", "Ray RLlib", "rl-library", ["rllib", "distributed reinforcement learning"]),

  // ── GPU Computing & Hardware Acceleration ──
  s("nvidia-cuda", "NVIDIA CUDA", "gpu-computing", ["cuda", "cuda c++", "cuda programming", "cuda kernels", "gpu acceleration", "cublas", "cudnn", "tensor cores"], ["high-demand", "core"]),
  s("nvidia-tensorrt", "NVIDIA TensorRT", "gpu-computing", ["tensorrt", "tensor rt", "deep learning inference optimizer"]),
  s("triton-lang", "OpenAI Triton (GPU Programming)", "gpu-computing", ["triton gpu language", "triton kernels", "openai triton"]),
  s("onnx-runtime", "ONNX Runtime", "model-optimization", ["onnx", "open neural network exchange", "onnx runtime cpu gpu", "onnx model export"]),
  s("openvino", "Intel OpenVINO", "model-optimization", ["openvino toolkit", "intel model optimization"]),
  s("core-ml", "Apple Core ML", "model-optimization", ["coreml", "apple core ml", "coremltools", "apple neural engine"]),
  s("qualcomm-snpe", "Qualcomm Neural Processing SDK (SNPE)", "model-optimization", ["snpe", "qualcomm npu"]),

  // ── Core AI Disciplines & Science ──
  s("ai-engineering-discipline", "AI Engineering", "discipline", ["ai engineer", "ai engineering", "llm application engineering", "production ai systems"], ["high-demand", "trending", "core"]),
  s("mlops-discipline", "MLOps Engineering", "discipline", ["mlops", "machine learning operations", "ml continuous delivery", "model lifecycle management"], ["high-demand", "core"]),
  s("data-science-discipline", "Data Science", "discipline", ["data scientist", "exploratory data analysis eda", "hypothesis testing", "ab testing", "predictive analytics"], ["high-demand", "core"]),
  s("recommendation-systems", "Recommendation Systems & Personalization", "ml-application", ["recommender systems", "collaborative filtering", "matrix factorization", "two-tower models", "deep retrieval", "personalization engine"], ["high-demand"]),
  s("graph-rag-concept", "Graph RAG & Knowledge-Enriched Retrieval", "genai-technique", ["graph rag", "knowledge graph rag", "neo4j rag", "entity-aware retrieval"]),
  s("ai-safety-alignment", "AI Safety, Guardrails & Alignment", "ai-safety", ["ai safety", "nemo guardrails", "guardrails ai", "prompt injection defense", "jailbreak prevention", "llm red teaming", "hallucination reduction"], ["trending", "high-demand"]),
  s("synthetic-data-generation", "Synthetic Data Generation for ML/LLM", "genai-technique", ["synthetic data", "data augmentation with llms", "synthetic dataset creation"]),
];
