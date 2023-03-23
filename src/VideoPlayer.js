import React, { useState, useEffect, useRef } from 'react';
import { AiFillPlayCircle, AiFillPauseCircle, AiFillMinusSquare, AiFillPlusSquare } from 'react-icons/ai';
import { MdForward5, MdReplay5 } from 'react-icons/md';
import { HiInformationCircle } from 'react-icons/hi';
import { BsSliders } from 'react-icons/bs';


const VideoPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedTime, setBufferedTime] = useState(0);
    const [loadedPercentage, setLoadedPercentage] = useState(0);
    const [speed, setSpeed] = useState(1);


    const videoRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const onTimeUpdate = () => {
            setCurrentTime(videoRef.current.currentTime);
        };

        const onDurationChange = () => {
            setDuration(videoRef.current.duration);
        };

        const onProgress = () => {
            if (videoRef.current.buffered.length > 0) {
                const bufferedEnd = videoRef.current.buffered.end(0);
                const percentage = (bufferedEnd / videoRef.current.duration) * 100;
                setLoadedPercentage(percentage);
                const progressBar = document.querySelector(".progress-bar");
                progressBar.style.backgroundImage = `linear-gradient(to right, grey ${percentage}%, transparent ${percentage}%)`;
            }
        };


        const video = videoRef.current;

        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('durationchange', onDurationChange);
        video.addEventListener('progress', onProgress);

        return () => {
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('durationchange', onDurationChange);
            video.removeEventListener('progress', onProgress);
        };
    }, [videoRef]);

    const handlePlayClick = () => {
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
        if (videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(0);
            setBufferedTime(bufferedEnd);
            setLoadedPercentage((bufferedEnd / videoRef.current.duration) * 100);
        } else {
            setLoadedPercentage(0);
        }
    };

    const handleProgressBarClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * videoRef.current.duration;
        videoRef.current.currentTime = time;
    };

    const handleBackward = () => {
        videoRef.current.currentTime -= 5;
    };

    const handleForward = () => {
        videoRef.current.currentTime += 5;
    };

    const handleSpeedIncrease = () => {
        const newSpeed = speed + 0.25;
        if (newSpeed <= 2) {
            setSpeed(newSpeed);
            videoRef.current.playbackRate = newSpeed;
        }
    };

    const handleSpeedDecrease = () => {
        const newSpeed = speed - 0.25;
        if (newSpeed >= 0.25) {
            setSpeed(newSpeed);
            videoRef.current.playbackRate = newSpeed;
        }
    };


    // function to format time in hours, minutes and seconds
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = Math.floor(time - hours * 3600 - minutes * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='videoplayer'>
            <video ref={videoRef} src={src} onTimeUpdate={handleTimeUpdate} playbackRate={speed} />
            <div onClick={handleProgressBarClick}>
                <div className='progress-bar'>
                    <progress className='progress' max={duration} value={currentTime} />
                    <span className='current-time'>{formatTime(currentTime)}</span>
                </div>
            </div>
            <div className='options'>
                <div className='slider' >
                    <BsSliders />
                </div>
                <div className='buttons'>
                    <div className='replay' onClick={handleBackward}>
                        <MdReplay5 />
                    </div>
                    <div onClick={handlePlayClick} className='play'>
                        {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                    </div>
                    <div className='forward' onClick={handleForward}>
                        <MdForward5 />
                    </div>
                </div>
                <div className='playback'>
                    <div className='minus' onClick={handleSpeedDecrease}>
                        <AiFillMinusSquare />
                    </div>
                    <div className='speed'>
                        {speed}x
                    </div>
                    <div className='plus' onClick={handleSpeedIncrease}>
                        <AiFillPlusSquare />
                    </div>
                </div>
                <div className='info'>
                    <HiInformationCircle />
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
