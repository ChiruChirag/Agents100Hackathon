# 🚀 EduVerse Complete Setup & Testing Guide

This guide will walk you through setting up and testing your EduVerse AI-powered learning system step by step.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Python 3.8+ installed
- [ ] Git installed
- [ ] A text editor (VS Code, Notepad++, etc.)
- [ ] Internet connection for API calls

---

## 🔧 Step 1: Environment Setup

### 1.1 Install Dependencies
```bash
# Install all required packages
pip install -r requirements.txt
```

### 1.2 Create Environment File
```bash
# Copy the example environment file
cp .env.example .env
```

### 1.3 Fill in API Keys
Open `.env` in your text editor and add your actual API keys:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_actual_project_id_here
APPWRITE_API_KEY=your_actual_api_key_here

# Google Gemini API
GOOGLE_API_KEY=your_actual_gemini_api_key_here

# Tavily API
TAVILY_API_KEY=your_actual_tavily_api_key_here

# Mem0 Configuration
MEM0_API_KEY=your_actual_mem0_api_key_here
```

**❗ Important:** Replace all `your_actual_*` placeholders with real API keys from [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md)

---

## 🗄️ Step 2: Appwrite Database Setup

### 2.1 Create Database
1. Go to your [Appwrite Console](https://cloud.appwrite.io/)
2. Navigate to **Databases**
3. Click **Create Database**
4. Name it: `eduverse_db`
5. Click **Create**

### 2.2 Create Collections
For each collection, follow the exact specifications in [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md):

1. **Create Collection: `users`**
   - Click **Create Collection**
   - Collection ID: `users`
   - Add all 7 attributes as specified

2. **Create Collection: `tutoring_sessions`**
   - Collection ID: `tutoring_sessions`
   - Add all 10 attributes as specified

3. **Create Collection: `study_schedules`**
   - Collection ID: `study_schedules`
   - Add all 11 attributes as specified

4. **Create Collection: `curated_resources`**
   - Collection ID: `curated_resources`
   - Add all 10 attributes as specified

5. **Create Collection: `exam_results`**
   - Collection ID: `exam_results`
   - Add all 16 attributes as specified

### 2.3 Set Permissions
For each collection:
1. Go to **Settings** tab
2. Under **Permissions**, add:
   - **Create**: `users`
   - **Read**: `users`
   - **Update**: `users`
   - **Delete**: `users`

---

## ✅ Step 3: Verify Setup

### 3.1 Run Setup Test
```bash
python test_setup.py
```

**Expected Output:**
```
🎓 EduVerse Setup Test
==================================================
🔍 Testing Basic Imports:
✅ fastapi
✅ uvicorn
✅ pydantic
✅ appwrite
✅ mem0
✅ tavily
✅ langgraph
✅ langchain_google_genai
✅ httpx
✅ python_dotenv

📊 Import Results: 10/10 successful

🔍 Testing Application Imports:
✅ app.config
✅ app.models
✅ app.services.appwrite_service
✅ app.services.mem0_service
✅ app.services.tavily_service
✅ app.agents.base_agent
✅ app.agents.tutor_agent
✅ app.agents.planner_agent
✅ app.agents.curator_agent
✅ app.agents.exam_agent
✅ app.routes.auth
✅ app.routes.agents

📊 App Import Results: 12/12 successful

🔍 Testing Environment:
✅ .env file found
✅ Configuration loaded
✅ Google Gemini API key configured
✅ Appwrite project configured

🔍 Testing Agent Initialization:
✅ Tutor Agent initialized
✅ Planner Agent initialized
✅ Curator Agent initialized
✅ Exam Agent initialized

📊 Agent Results: 4/4 successful

==================================================
🎉 All tests passed! EduVerse is ready to run.
🚀 Start the server with: python run.py
```

### 3.2 Fix Any Issues
If you see ❌ errors:
- **Import errors**: Run `pip install -r requirements.txt` again
- **API key errors**: Check your `.env` file
- **Agent errors**: Verify all imports are working

---

## 🚀 Step 4: Start the Server

### 4.1 Run the Application
```bash
python run.py
```

**Expected Output:**
```
🎓 EduVerse - AI-Powered Learning Backend
==================================================
📦 Install/Update dependencies? (y/n): n
🚀 Starting EduVerse backend...
📚 AI-Powered Learning System
🌐 Server will be available at: http://localhost:8000
📖 API Documentation: http://localhost:8000/docs
🔄 Press Ctrl+C to stop the server
--------------------------------------------------
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### 4.2 Verify Server is Running
Open your browser and go to:
- **API Info**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 🧪 Step 5: Test the System

### 5.1 Test Health Endpoint
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "services": {
    "appwrite": "connected",
    "gemini": "connected",
    "mem0": "connected",
    "tavily": "connected"
  }
}
```

### 5.2 Test User Registration
```bash
curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Student",
       "email": "test@example.com",
       "password": "testpass123"
     }'
```

**Expected Response:**
```json
{
  "user_id": "uuid-here",
  "name": "Test Student",
  "email": "test@example.com",
  "message": "User registered successfully"
}
```

### 5.3 Test User Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "testpass123"
     }'
```

**Save the `user_id` from the response for the next tests!**

### 5.4 Test AI Tutor Agent
Replace `USER_ID_HERE` with your actual user_id:

```bash
curl -X POST "http://localhost:8000/agents/tutor/USER_ID_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "topic": "quadratic equations",
       "subject": "mathematics",
       "difficulty_level": "beginner"
     }'
```

**Expected Response:**
```json
{
  "session_id": "uuid-here",
  "explanation": "Detailed explanation of quadratic equations...",
  "examples": ["x² + 5x + 6 = 0", "2x² - 3x - 2 = 0"],
  "additional_resources": ["Khan Academy: Quadratic Equations", "..."],
  "learning_tips": ["Practice with simple examples first", "..."]
}
```

### 5.5 Test Study Planner Agent
```bash
curl -X POST "http://localhost:8000/agents/planner/USER_ID_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "subjects": ["mathematics", "physics"],
       "days_ahead": 5,
       "daily_hours": 2
     }'
```

### 5.6 Test Resource Curator Agent
```bash
curl -X POST "http://localhost:8000/agents/curator/USER_ID_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "topic": "calculus",
       "subject": "mathematics",
       "resource_types": ["video", "article"]
     }'
```

### 5.7 Test Exam Coach Agent
```bash
curl -X POST "http://localhost:8000/agents/exam/create/USER_ID_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "topic": "algebra",
       "subject": "mathematics",
       "question_count": 5,
       "difficulty": "medium"
     }'
```

---

## 🌐 Step 6: Test with Browser (Interactive)

### 6.1 Open API Documentation
Go to: http://localhost:8000/docs

### 6.2 Test Authentication
1. Find **POST /auth/register**
2. Click **Try it out**
3. Fill in the request body:
   ```json
   {
     "name": "Browser Test User",
     "email": "browser@test.com",
     "password": "browsertest123"
   }
   ```
4. Click **Execute**
5. Copy the `user_id` from the response

### 6.3 Test Agents Interactively
1. Find **POST /agents/tutor/{user_id}**
2. Click **Try it out**
3. Enter your `user_id` in the path parameter
4. Fill in request body:
   ```json
   {
     "topic": "photosynthesis",
     "subject": "biology",
     "difficulty_level": "intermediate"
   }
   ```
5. Click **Execute**
6. Observe the AI-generated response

### 6.4 Repeat for Other Agents
Test each agent endpoint with different topics and subjects.

---

## 📊 Step 7: Verify Data Storage

### 7.1 Check Appwrite Database
1. Go to your Appwrite Console
2. Navigate to **Databases** → `eduverse_db`
3. Check each collection:
   - `users` should have your test users
   - `tutoring_sessions` should have session records
   - `study_schedules` should have study plans
   - `curated_resources` should have found resources
   - `exam_results` should have exam data

### 7.2 Check Mem0 Memory
The agents should be storing learning context in Mem0 for personalization.

---

## 🎯 Step 8: Performance Testing

### 8.1 Test Multiple Concurrent Requests
```bash
# Run multiple requests at once
for i in {1..5}; do
  curl -X POST "http://localhost:8000/agents/tutor/USER_ID_HERE" \
       -H "Content-Type: application/json" \
       -d '{"topic": "test'$i'", "subject": "mathematics"}' &
done
wait
```

### 8.2 Monitor Server Logs
Check the terminal where your server is running for any errors or performance issues.

---

## ⚠️ Troubleshooting Common Issues

### Issue: "Import Error"
**Solution:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: "API Key Invalid"
**Solution:**
1. Double-check your `.env` file
2. Ensure no extra spaces around API keys
3. Verify keys are valid in their respective services

### Issue: "Appwrite Connection Failed"
**Solution:**
1. Check your Appwrite project ID
2. Verify the API key has correct permissions
3. Ensure database and collections exist

### Issue: "Agent Response Empty"
**Solution:**
1. Check your Google Gemini API key
2. Verify you have API usage quota remaining
3. Check server logs for detailed error messages

### Issue: "Memory Service Error"
**Solution:**
1. Verify Mem0 API key
2. Check if you have free tier quota remaining

---

## 🎉 Success Indicators

Your system is working correctly if:
- ✅ All test endpoints return successful responses
- ✅ Data appears in your Appwrite database
- ✅ AI responses are relevant and personalized
- ✅ No error messages in server logs
- ✅ Interactive documentation works smoothly

---

## 🔄 Next Steps

Once everything is working:
1. **Customize prompts** in agent files for better responses
2. **Add more subjects** and topics to test with
3. **Integrate with a frontend** using the API endpoints
4. **Monitor usage** through service dashboards
5. **Scale up** API quotas as needed

---

## 📞 Getting Help

If you encounter issues:
1. Check the server logs in your terminal
2. Test individual components with `python test_setup.py`
3. Verify API keys are working in their respective services
4. Check the `/health` endpoint for service status

**Your EduVerse AI Learning System is now ready to use! 🚀** 