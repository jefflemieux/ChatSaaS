'use client'

import * as React from 'react'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import * as motion from 'motion/react-client'

// global variable to save microphone stream
let micStream: any;
let recorder: any;

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
	interface Window {
		webkitSpeechRecognition: any;
	}
}

export default function AudioMotion({ activate, setPrompt, lang }: { activate: boolean, setPrompt: any, setActivate: any, lang: string }) {
	const [_transcript, setTranscript] = React.useState("");
	const [mounted, setMounted] = React.useState(false);

	const audioContainerRef = React.useRef<any>(null);
	const recognitionRef = React.useRef<any>(null);

	// Function to start recording
	const startRecording = () => {
		// Create a new SpeechRecognition instance and configure it
		recognitionRef.current = new window.webkitSpeechRecognition();
		recognitionRef.current.continuous = true;
		recognitionRef.current.interimResults = true;
		recognitionRef.current.lang = lang === 'fr' ? 'fr-FR' : 'en-CA';

		// Event handler for speech recognition results
		recognitionRef.current.onresult = (event: any) => {
			var res = "";
			for (let i = 0; i < event.results.length; i++) {
				const { transcript } = event.results[i][0];
				res += " " + transcript;
			}
			setTranscript(_transcript + ' ' + res);
			setPrompt(_transcript + ' ' + res);
		};

		// Start the speech recognition
		recognitionRef.current.start();
	};

	// Function to stop recording
	const stopRecording = () => {
		if (recognitionRef.current) {
			// Stop the speech recognition and mark recording as complete
			recognitionRef.current.stop();
			setPrompt(_transcript);
		}
	};


	// Cleanup effect when the component unmounts
	React.useEffect(() => {
		return () => {
			// Stop the speech recognition if it's active
			if (recognitionRef.current) {
				recognitionRef.current.stop();
				audioContainerRef.current == null;
			}
		};
	}, []);

	React.useEffect(() => {
		if (activate && !mounted) {
			if (audioContainerRef !== null) {
				const audioMotion = new AudioMotionAnalyzer(
					audioContainerRef.current,
					{
						gradient: 'rainbow',
						showScaleX: false,
						showScaleY: false,
						showBgColor: false,
						reflexRatio: 0.5,
						reflexAlpha: 1,
						showPeaks: false,
						roundBars: true,
					}
				);
				setMounted(true);
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia({ audio: true, video: false })
						.then((stream) => {
							// create stream using audioMotion audio context
							micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
							// connect microphone stream to analyzer
							audioMotion.connectInput(micStream);
							// mute output to prevent feedback loops from the speakers
							audioMotion.volume = 0;
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
		}

	}, [audioContainerRef, activate]);

	React.useEffect(() => {
		if (activate) {
			startRecording()
		} else {
			stopRecording()
		}
	}, [activate])


	return (
		<>
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				style={{ height: '150px' }}
				ref={audioContainerRef}
			/>
		</>
	)
}