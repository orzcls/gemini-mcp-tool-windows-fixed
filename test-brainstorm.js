import { executeGeminiCLI } from './lib/fixed-geminiExecutor.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'lib', '.env') });

console.log('=== Testing Brainstorm Tool Execution ===');
console.log(`GEMINI_API_KEY loaded: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO'}`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Script directory: ${__dirname}`);

// Simulate the exact brainstorm call that's failing
async function testBrainstormExecution() {
    try {
        console.log('\n--- Testing Brainstorm Execution ---');
        
        // This is the exact prompt structure used by brainstorm tool
        const brainstormPrompt = `BRAINSTORMING SESSION

Challenge: 设计一个可持续能源解决方案

Generate 12 creative and diverse ideas. For each idea, provide a brief feasibility assessment and potential impact.`;
        
        console.log('Calling executeGeminiCLI with brainstorm prompt...');
        console.log('Prompt preview:', brainstormPrompt.substring(0, 100) + '...');
        
        const result = await executeGeminiCLI(brainstormPrompt, undefined, false, false);
        
        console.log('✅ Brainstorm execution successful!');
        console.log('Result length:', result.length);
        console.log('Result preview:', result.substring(0, 200) + '...');
        
    } catch (error) {
        console.log('❌ Brainstorm execution failed!');
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        console.log('Error code:', error.code);
        console.log('Error errno:', error.errno);
        console.log('Error syscall:', error.syscall);
        console.log('Error path:', error.path);
    }
}

// Test with different scenarios
async function testMultipleScenarios() {
    const scenarios = [
        {
            name: 'Simple English prompt',
            prompt: 'BRAINSTORMING SESSION\n\nChallenge: Design a sustainable energy solution\n\nGenerate 5 creative ideas.'
        },
        {
            name: 'Chinese prompt (original failing case)',
            prompt: 'BRAINSTORMING SESSION\n\nChallenge: 设计一个可持续能源解决方案\n\nGenerate 12 creative and diverse ideas. For each idea, provide a brief feasibility assessment and potential impact.'
        },
        {
            name: 'Mixed language prompt',
            prompt: 'BRAINSTORMING SESSION\n\nChallenge: Design a 可持续能源 solution\n\nGenerate 3 ideas.'
        }
    ];
    
    for (const scenario of scenarios) {
        console.log(`\n=== Testing: ${scenario.name} ===`);
        try {
            const result = await executeGeminiCLI(scenario.prompt, undefined, false, false);
            console.log(`✅ ${scenario.name}: Success (${result.length} chars)`);
        } catch (error) {
            console.log(`❌ ${scenario.name}: Failed - ${error.message}`);
            if (error.message.includes('spawn powershell.exe ENOENT')) {
                console.log('🔍 This is the exact error reported by the user!');
            }
        }
    }
}

// Run all tests
async function runAllTests() {
    console.log('Starting comprehensive brainstorm testing...');
    
    await testBrainstormExecution();
    await testMultipleScenarios();
    
    console.log('\n=== Testing completed ===');
}

runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
});