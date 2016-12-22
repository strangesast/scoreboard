import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable()
export class AdminService implements Resolve<void> {

  public listA: string[] = [1, 2, 3, 4, 5].map(n => 'Item ' + String.fromCharCode(n + 64));
  public listB: string[] = [1, 2, 3].map(n => 'Item ' + n);

  constructor() { }

  resolve() {
    return this.init();
  }

  init() {

    let RTCPeerConnection =
      (<any>window).RTCPeerConnection ||
      (<any>window).webkitRTCPeerConnection ||
      (<any>window).mozRTCPeerConnection;

    let servers = null;
    let ips = [];

    let localConnection = new RTCPeerConnection({ iceServers: [] });

    let sendChannel = localConnection.createDataChannel('');

    localConnection.onicecandidate = (e) => {
      if(!e.candidate) {
        localConnection.close();
        console.log('ips', ips);
        return;
      }
      let ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
      ips.push(ip);
    }

    localConnection.createOffer().then(desc => {
      localConnection.setLocalDescription(desc);
    }, err => {
      console.error('createOffer error');
    });

    /*
    let localIceCallback = (e) => {
      console.log('local ice callback');
      if(e.candidate) {
        remoteConnection.addIceCandidate(e.candidate).then((_e) => {
          console.log('onAddIceCandidateSuccess');
        }, (_e) => {
          console.error('onAddIceCandidateError');
        });
      }
    }
    localConnection.onicecandidate = localIceCallback;
    let onSendChannelStateChange = (e) => {
      let readyState = e.readyState;
      if (readyState == 'open') {
        console.log('send channel ready');

      } else {
        console.log('send channel not ready');
      }
    }
    sendChannel.onopen = onSendChannelStateChange;
    sendChannel.onclose = onSendChannelStateChange;

    let remoteConnection = new RTCPeerConnection(servers, null);

    let remoteIceCallback = (e) => {
      console.log('remote ice callback');
      if (e.candidate) {
        localConnection.addIceCandidate(e.candidate).then((_e)=>{
          console.log('onAddIceCandidateSuccess');
        },(_e)=>{
          console.error('onAddIceCandidateError');
        });
      }
    }
    remoteConnection.onicecandidate = remoteIceCallback;

    let onReceiveMessageCallback = (e) => {
      console.log('received message:', e.data);
    }

    let onReceiveChannelStateChange = (e) => {
      console.log('state change', e.readyState);
    }

    let receiveChannelCallback = (e) => {
      console.log('receiveChannelCallback');
      receiveChannel = e.channel;
      receiveChannel.onmessage = onReceiveMessageCallback;
      receiveChannel.onopen = onReceiveChannelStateChange;
      receiveChannel.onclose = onReceiveChannelStateChange;
    }
    remoteConnection.ondatachannel = receiveChannelCallback;

    localConnection.createOffer().then((desc1)=>{
      localConnection.setLocalDescription(desc1);

      console.log('Offer from localConnection', desc1.sdp);

      remoteConnection.setRemoteDescription(desc1);

      remoteConnection.createAnswer().then((desc2)=>{
        remoteConnection.setLocalDescription(desc2);
        console.log('Answer from remoteConnection', desc2.sdp);
        localConnection.setRemoteDescription(desc2);

      }, (err2) => console.error('\'remoteConnection.createAnswer\' error', err2));

    }, (err1)=>console.error('\'localConnection.createOffer\' error', err1))
    */

    return Promise.resolve();
  }
}
