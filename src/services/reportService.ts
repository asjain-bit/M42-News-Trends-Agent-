import { ReportInputs, ReportVersion } from "./storageService";
import { v4 as uuidv4 } from "uuid";

export const reportService = {
  generate: async (inputs: ReportInputs, onProgress: (stage: string) => void): Promise<ReportVersion> => {
    return new Promise((resolve) => {
      // Simulate multi-stage delay
      onProgress("Researching");
      
      setTimeout(() => {
        onProgress("Analysing");
        
        setTimeout(() => {
          onProgress("Scoring");
          
          setTimeout(() => {
            resolve({
              id: uuidv4(),
              versionNumber: 1, // Will be overridden by the store based on history
              createdAt: Date.now(),
              content: {
                headline: "Strong tech growth in selected region with notable funding gaps",
                confidence: "High",
                lowConfidenceCount: 0,
                sections: [
                  {
                    title: "Market Players",
                    confidence: "High",
                    body: "Key players include startups A, B, and established firm C."
                  },
                  {
                    title: "Funding Landscape",
                    confidence: "Medium",
                    body: "Series A funding is down 15% year-over-year, but seed funding remains robust."
                  }
                ]
              }
            });
          }, 2000); // 2s
        }, 3000); // 3s
      }, 2000); // 2s
    });
  }
};
