// Define the MagicPropertiesProvider class (example implementation)
class MagicPropertiesProvider {
    // Add your provider implementation here
    constructor() {
        // Initialize provider
        const self = this;
    }

    // Example methods
    getProperty(key: string): any {
        // Implementation
    }

    setProperty(key: string, value: any): void {
        // Implementation
    }
}

// Define the configuration interface
interface DependencyConfig {
    '**init**': string[];
    magicPropertiesProvider: [string, typeof MagicPropertiesProvider];
}

// Export the configuration object with proper typing
const config: DependencyConfig = {
    '**init**': ['magicPropertiesProvider'],
    magicPropertiesProvider: ['type', MagicPropertiesProvider]
};

export default config;