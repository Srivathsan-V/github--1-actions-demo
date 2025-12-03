from pathlib import Path
from enum import Enum
from abc import ABC, abstractmethod
import logging

# Configure logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

# Constants
PLANNING_PHASE = "planning"
EXECUTION_PHASE = "execution"
TEST_GUIDELINES_PLACEHOLDER = "{test_guidelines}"

class Framework(Enum):
    NODEJS = "nodejs"
    PYTHON = "python"
    UNKNOWN = "unknown"

# Strategy Pattern Implementation
class FrameworkStrategy(ABC):
    """Abstract base class for framework-specific strategies"""
    
    @abstractmethod
    def detect(self, project_root: Path) -> bool:
        """Detect if this framework is present in the project"""
        pass
    
    @abstractmethod
    def get_guidelines(self) -> str:
        """Get testing guidelines for this framework"""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return the framework name"""
        pass

class NodeJSStrategy(FrameworkStrategy):
    """Strategy for Node.js projects"""
    
    def detect(self, project_root: Path) -> bool:
        """Detect Node.js project by looking for package.json"""
        try:
            # Check root directory
            if (project_root / "package.json").exists():
                return True
            
            # Search in subdirectories
            for item in project_root.rglob("package.json"):
                if item.is_file():
                    return True
            
            return False
        except Exception as e:
            logger.warning(f"Node.js detection failed: {e}")
            return False
    
    def get_guidelines(self) -> str:
        """Return Node.js testing guidelines"""
        return """
        
        Node.js Testing Guidelines:
        - Use Jest for unit tests
        - Place tests in __tests__/ or *.test.js files
        - Mock external dependencies with jest.mock()
        - Use describe/it/test blocks
        - Assert with expect() syntax
        - Test async functions with async/await
        - Use beforeEach/afterEach for setup/teardown
        """
    
    @property
    def name(self) -> str:
        return Framework.NODEJS.value

class PythonStrategy(FrameworkStrategy):
    """Strategy for Python projects"""
    
    def detect(self, project_root: Path) -> bool:
        """Detect Python project by looking for Python indicators"""
        try:
            python_files = ["requirements.txt", "pyproject.toml", "setup.py"]
            
            # Check root directory
            if any((project_root / f).exists() for f in python_files):
                return True
            
            # Search in subdirectories
            for item in project_root.rglob("*"):
                if item.is_file() and item.name in python_files:
                    return True
            
            return False
        except Exception as e:
            logger.warning(f"Python detection failed: {e}")
            return False
    
    def get_guidelines(self) -> str:
        """Return Python testing guidelines"""
        return """
        
        Python Testing Guidelines:
        - Use pytest for unit tests
        - Place tests in tests/ directory
        - Use fixtures for setup/teardown
        - Assert with assert statements
        - Mock with unittest.mock
        - Use parametrize for multiple test cases
        - Follow PEP 8 naming conventions
        """
    
    @property
    def name(self) -> str:
        return Framework.PYTHON.value

class DefaultStrategy(FrameworkStrategy):
    """Default strategy for unknown frameworks"""
    
    def detect(self, project_root: Path) -> bool:
        """Always returns True as fallback"""
        return True
    
    def get_guidelines(self) -> str:
        """Return general testing guidelines"""
        return """
        
        General Testing Guidelines:
        - Write unit tests for core functionality
        - Test edge cases and error conditions
        - Keep tests independent and isolated
        - Use descriptive test names
        - Follow your framework's best practices
        """
    
    @property
    def name(self) -> str:
        return Framework.UNKNOWN.value

class FrameworkDetector:
    """Context class that uses framework strategies"""
    
    def __init__(self):
        self.strategies = [
            NodeJSStrategy(),
            PythonStrategy(),
            DefaultStrategy(),  # Always last as fallback
        ]
    
    def detect_framework(self, project_root: Path) -> FrameworkStrategy:
        """Detect and return the appropriate framework strategy"""
        for strategy in self.strategies:
            if strategy.detect(project_root):
                logger.info(f"Detected framework: {strategy.name}")
                return strategy
        
        # Should never reach here due to DefaultStrategy
        return DefaultStrategy()

class GuidelineInjector:
    """Handles guideline injection using detected strategy"""
    
    def __init__(self, detector: FrameworkDetector = None):
        self.detector = detector or FrameworkDetector()
    
    def inject_guidelines(self, prompt: str, project_root: Path) -> str:
        """Inject framework-specific guidelines into prompt"""
        try:
            strategy = self.detector.detect_framework(project_root)
            guidelines = strategy.get_guidelines()
            return prompt.replace(TEST_GUIDELINES_PLACEHOLDER, guidelines)
        except Exception as e:
            logger.warning(f"Guideline injection failed: {e}")
            return prompt.replace(TEST_GUIDELINES_PLACEHOLDER, "")

def run(prompt: str, phase: str = PLANNING_PHASE) -> str:
    """
    Run prompt with optional guideline injection using Strategy pattern
    
    Args:
        prompt: The prompt template with {test_guidelines} placeholder
        phase: PLANNING_PHASE or EXECUTION_PHASE
    
    Returns:
        LLM response
    """
    if phase == EXECUTION_PHASE:
        try:
            project_root = Path(__file__).resolve().parent
            injector = GuidelineInjector()
            prompt = injector.inject_guidelines(prompt, project_root)
        except Exception as e:
            logger.warning(f"Strategy-based injection failed: {e}")
            # Fallback: remove placeholder without injection
            prompt = prompt.replace(TEST_GUIDELINES_PLACEHOLDER, "")
    
    return call_llm(prompt)

def call_llm(prompt: str) -> str:
    """
    Your actual LLM call implementation
    
    Args:
        prompt: Processed prompt to send to LLM
    
    Returns:
        LLM response
    """
    # TODO: Implement your LLM API call here
    print(f"LLM Prompt: {prompt}")
    return "LLM response"

# Original file search functionality
class_name = 'sample'
patterns = [
    f"*/tests/{class_name}.test.js",          # src/tests/..., app/tests/...
    f"*/*/__tests__/{class_name}.test.js",    # app/components/__tests__/..., app/controllers/__tests__/...
    f"*/*/tests/{class_name}.test.js",        # app/somefolder/tests/...
]

def main():
    """Original file search functionality"""
    test_root = Path(__file__).resolve().parent
    for pattern in patterns:
        for p in test_root.rglob(pattern):
            if p.is_file():
                print(str(p))

# Example usage functions
def planning_phase():
    """Example: Planning phase without guideline injection"""
    prompt = f"Create test plan {TEST_GUIDELINES_PLACEHOLDER}"
    return run(prompt, phase=PLANNING_PHASE)

def execution_phase():
    """Example: Execution phase with guideline injection"""
    prompt = f"Generate tests {TEST_GUIDELINES_PLACEHOLDER}"
    return run(prompt, phase=EXECUTION_PHASE)

def test_framework_detection():
    """Test function to verify framework detection"""
    project_root = Path(__file__).resolve().parent
    framework = ProjectDetector.detect_framework(project_root)
    print(f"Detected framework: {framework.value}")
    print(f"Guidelines: {GuidelineInjector.get_guidelines(framework)}")

if __name__ == "__main__":
    main()