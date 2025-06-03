

export const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1ej2c9n" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (http://demo.bpmn.io)" exporterVersion="18.6.1">
  <bpmn:process id="Process_1xsosop" isExecutable="false">
    <bpmn:startEvent id="StartEvent_0ih6bhn">
      <bpmn:outgoing>Flow_12f9059</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1p6bfix">
      <bpmn:incoming>Flow_12f9059</bpmn:incoming>
      <bpmn:outgoing>Flow_0khqxhn</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_12f9059" sourceRef="StartEvent_0ih6bhn" targetRef="Activity_1p6bfix" />
    <bpmn:endEvent id="Event_09fftpb">
      <bpmn:incoming>Flow_0khqxhn</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0khqxhn" sourceRef="Activity_1p6bfix" targetRef="Event_09fftpb" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1xsosop">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0ih6bhn">
        <dc:Bounds x="156" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1p6bfix_di" bpmnElement="Activity_1p6bfix">
        <dc:Bounds x="250" y="60" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_09fftpb_di" bpmnElement="Event_09fftpb">
        <dc:Bounds x="412" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_12f9059_di" bpmnElement="Flow_12f9059">
        <di:waypoint x="192" y="100" />
        <di:waypoint x="250" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0khqxhn_di" bpmnElement="Flow_0khqxhn">
        <di:waypoint x="350" y="100" />
        <di:waypoint x="412" y="100" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`