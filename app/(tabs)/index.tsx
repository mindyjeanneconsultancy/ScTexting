import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Linking, Platform, StyleSheet, Text, View } from 'react-native';
export default function Index() {

  const now = new Date();
  console.log(now.toString());
  const numbersFile = "https://raw.githubusercontent.com/mindyjeanneconsultancy/SmsTexting/refs/heads/main/websiteinfo.txt";
  const original = "This is Mindy's first Native React Application " + now.toLocaleTimeString();
  const [message, setMessage] = useState(original);

  const toggleMessage = () => {
    if (message === original) {
      setMessage("Button Clicked!");
    } else {
      setMessage(original);
    }
  };

  const [textContent, setTextContent] = useState('');
  const [fileName, setfileName] = useState( 'https://luxury-sunshine-667461.netlify.app/websiteinfo.txt') ;
  const handleReadFile = () => {
    setMessage ( "Trying to load file");
    fetch(fileName)
     .then(res => res.text())
     .then(data => setTextContent(data))
     .catch(err => setTextContent('Error: ' + err.message + " " +fileName));
};

function processTextAndSendSMS(text) {
  // Clean Windows line endings
  const cleaned = text.replace(/\r/g, '');

  // Split into lines (optional, if you need them)
  const lines = cleaned.split('\n');

  // Extract phone numbers
  const numbers = cleaned.match(/\d{3}-\d{3}-\d{4}/g);
  if (!numbers || numbers.length === 0) {
    return { error: "No phone numbers found." };
  }

  // Format for iOS vs Android
  const recipientString =
    Platform.OS === "ios"
      ? numbers.join(",")
      : numbers.join(";");

  // Build SMS URL
  const smsURL = `sms:${recipientString}`;

  return { smsURL, numbers };
}

const iPhoneReadFile = async () => {
  try {
    setMessage("Trying to load file...");

    const response = await fetch(numbersFile);

    if (!response.ok) {
      setTextContent("Error fetching file: " + response.status);
      return;
    }

    const text = await response.text();

    // 🔥 Call your helper function here
    const result = processiPhoneTextAndSendSMS(text);

    // Handle errors from helper
    if (result.error) {
      setTextContent(result.error);
      return;
    }

    // Update UI with numbers found
    setTextContent("Found numbers: " + result.numbers.join(", "));

    // Try to open SMS app
    const supported = await Linking.canOpenURL(result.smsURL);
    if (!supported) {
      setTextContent("SMS not supported on this device.");
      return;
    }

    await Linking.openURL(result.smsURL);

    setTextContent("SMS app opened successfully.");

  } catch (err) {
    setTextContent("Unexpected error: " + err.message);
  }
};


function processiPhoneTextAndSendSMS(text) {
  const cleaned = text.replace(/\r/g, '');
  const numbers = cleaned.match(/\d{3}-\d{3}-\d{4}/g);

  if (!numbers || numbers.length === 0) {
    return { error: "No phone numbers found." };
  }

  const recipientString =
    Platform.OS === "ios"
      ? numbers.join(",")
      : numbers.join(";");

  const body = encodeURIComponent("Hello from my app!");

  // ⭐ Correct SMS URL format
  const smsURL = `sms:${recipientString}?body=${body}`;

  return { smsURL, numbers };
}




const loadFile = async () => {
  try {
    const response = await fetch ('https://luxury-sunshine-667461.netlify.app/websiteinfo.txt');

    if (!response.ok) {
      throw new Error('Network response was not ok, Lenny Bruce is not afraid');    }

    const text  = await response.text();
    const result= processTextAndSendSMS(text);
  
    Linking.openURL(`sms:${result}`);
    setTextContent(result);
  } 
  catch (error) {
    setTextContent ( "Error:=> " + error.message )
    console.log("Fetch error:", error.message);
  }
};

  return (
    <View style={styles.container}>

      {/* FIRST BLOCK */}
      <View style={styles.firstBlock}>
        <Text style={styles.message}>{message}</Text>
        <Button title="Toggle Message" onPress={toggleMessage} />
        <StatusBar style="auto" />
      </View>

      {/* SECOND BLOCK */}
      <View style={styles.secondBlock}>

        <Button title="Read Text File - iPhone Version" onPress={iPhoneReadFile} />
        
        <Text style={styles.output}>
          {textContent || 'Press the button to load the file'}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    color: 'navy',
    fontSize: 24,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  firstBlock: {
    marginBottom: 40,
  },
  secondBlock: {
    marginTop: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  output: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});