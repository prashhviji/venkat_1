const API_BASE_URL = 'http://localhost:8000/api';

export interface RecommendationRequest {
  soil?: string;
  location?: string;  // Added location for regional context
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  ph?: number;
  nitrogen?: number;
  phosphorous?: number;
  potassium?: number;
  carbon?: number;
}

export interface RotationRequest {
  region?: string;
  soil_type?: string;
  start_season?: string;
  crop1?: string;
  crop2?: string;
  crop3?: string;
  number_of_seasons?: number;
}

export interface YieldRequest {
  crop?: string;
  season?: string;
  state?: string;
  area_hectares?: number;
}

export interface RecommendationResponse {
  crops: string[];
}

export interface RotationResponse {
  yield_t_per_ha: number | null;
  carbon_kg_co2: number | null;
}

export interface YieldResponse {
  yield_t_per_ha: number | null;
}

export const apiClient = {
  async getCropRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get crop recommendations:', error);
      throw error;
    }
  },

  async getRotationPredictions(data: RotationRequest): Promise<RotationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/rotation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get rotation predictions:', error);
      throw error;
    }
  },

  async getYieldPrediction(data: YieldRequest): Promise<YieldResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/yield`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get yield prediction:', error);
      throw error;
    }
  },
};