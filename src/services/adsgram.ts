/**
 * Adsgram SDK Service
 * Block ID: int-55309
 * Script: https://sad.adsgram.ai/js/sad.min.js
 */

export interface AdsgramShowResult {
  done: boolean;
  description: string;
  state: 'load' | 'render' | 'reward' | 'dismiss' | 'error';
  error?: boolean;
}

export interface AdsgramInitParams {
  blockId: string;
  debug?: boolean;
  debugBannerType?: 'RewardedVideo' | 'FullscreenMedia';
}

declare global {
  interface Window {
    Adsgram?: {
      init: (params: AdsgramInitParams) => {
        show: () => Promise<AdsgramShowResult>;
        destroy?: () => void;
      };
    };
  }
}

const ADSGRAM_SCRIPT_URL = 'https://sad.adsgram.ai/js/sad.min.js';
export const ADSGRAM_BLOCK_ID = 'int-55309';

class AdsgramService {
  private scriptLoadingPromise: Promise<boolean> | null = null;
  private isLoaded: boolean = false;

  /**
   * Load Adsgram SDK asynchronously
   */
  public async loadSDK(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    if (window.Adsgram) {
      this.isLoaded = true;
      return true;
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise((resolve) => {
      // Check if existing script tag exists
      const existingScript = document.querySelector(`script[src="${ADSGRAM_SCRIPT_URL}"]`);
      if (existingScript && window.Adsgram) {
        this.isLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = ADSGRAM_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        this.isLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        // Fallback gracefully so app remains functional even if offline or adblocked
        resolve(false);
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Show ad with blockId int-55309
   * @param blockId Defaults to int-55309
   */
  public async showAd(blockId: string = ADSGRAM_BLOCK_ID): Promise<{ success: boolean; message: string; isSimulated?: boolean }> {
    await this.loadSDK();

    if (window.Adsgram) {
      try {
        const adController = window.Adsgram.init({
          blockId: blockId,
          debug: false,
        });

        const result = await adController.show();
        if (result && result.done) {
          return {
            success: true,
            message: 'Ad completed! Reward verified and credited.',
            isSimulated: false,
          };
        } else {
          return {
            success: false,
            message: result?.description || 'Ad skipped or dismissed early.',
            isSimulated: false,
          };
        }
      } catch (err: unknown) {
        const errorObj = err as { description?: string; message?: string };
        const msg = errorObj.description || errorObj.message || 'Adsgram ad load error';
        return {
          success: false,
          message: msg,
          isSimulated: false,
        };
      }
    } else {
      return {
        success: false,
        message: 'Adsgram SDK script not reachable or blocked by browser extension.',
        isSimulated: true,
      };
    }
  }
}

export const adsgramService = new AdsgramService();
