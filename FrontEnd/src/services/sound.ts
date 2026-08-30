type SoundType = "login" | "taskCompleted";

let audioContext: AudioContext | null = null;
let enabled = localStorage.getItem("taskly_sound_enabled") !== "false";

export function setSoundEnabled(value: boolean) {
  enabled = value;
  localStorage.setItem("taskly_sound_enabled", String(value));
}

function getAudioContext() {
  if (audioContext) return audioContext;

  const browserWindow = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioContextConstructor =
    browserWindow.AudioContext || browserWindow.webkitAudioContext;

  if (!AudioContextConstructor) return null;

  audioContext = new AudioContextConstructor();
  return audioContext;
}

// Deve ser chamado durante uma interação direta, como clique ou envio de formulário.
// Assim o navegador libera o contexto de áudio antes da chamada assíncrona da API.
export function prepareSound() {
  if (!enabled) return;
  const context = getAudioContext();
  if (context?.state === "suspended") void context.resume();
}

// Sons breves sintetizados no navegador evitam arquivos de áudio extras e carregamento adicional.
export function playSound(type: SoundType) {
  if (!enabled) return;
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume();
  }

  const isLoginSound = type === "login";
  const notes = isLoginSound
    ? [392, 493.88, 587.33, 783.99]
    : [523.25, 659.25];
  const noteInterval = isLoginSound ? 0.16 : 0.09;
  const duration = isLoginSound ? 0.62 : 0.18;
  const volume = isLoginSound ? 0.035 : 0.09;

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * noteInterval;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  });

}
