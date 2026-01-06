import baseApi from "./apiService";

export const setInterviewPattern = async (sessionData) => {
    return await baseApi.post("/resume/createInterviewPattern", sessionData);
}

export const NewInterviewQuestions = async (sessionId , signal) => {
    return await baseApi.get(`/questions/startInterview/${sessionId}`,{
    
    timeout: 30000 ,
    signal: signal
    });
}

// export const saveCurrentQuestion = async (sessionId, questionId , answer)=>{
//     return await baseApi.post(`/useranswers/saveUserAnswer/${sessionId}/${questionId}`, {answer});
// }






export const saveCurrentQuestion = async (interviewId, questionIndex, transcript) => {
  return  await baseApi.post(`/useranswers/saveUserAnswer/${interviewId}/${questionIndex}`, { 
        answer: transcript  // 'transcript' is a string
    });
   
};



export const generateAiAnalysis = async (interviewId) =>{
    return await baseApi.get(`/reports/generateReport/${interviewId}`,{
    
    timeout: 100000 
    })
    }