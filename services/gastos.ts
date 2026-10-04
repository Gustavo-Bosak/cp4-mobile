import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export type Gasto = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
};

export type GastoDados = Omit<Gasto, "id">;

function registrosRef(uid: string) {
  return collection(db, "usuarios", uid, "registros");
}

function registroRef(uid: string, id: string) {
  return doc(db, "usuarios", uid, "registros", id);
}

export function escutarGastos(
  uid: string,
  aoAtualizar: (gastos: Gasto[]) => void,
  aoFalhar: (erro: unknown) => void
): Unsubscribe {
  return onSnapshot(
    registrosRef(uid),
    (snapshot) => {
      const gastos = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as GastoDados),
      }));
      aoAtualizar(gastos);
    },
    aoFalhar
  );
}

// Create
export async function criarGasto(uid: string, dados: GastoDados): Promise<void> {
  await addDoc(registrosRef(uid), dados);
}

// Read de um único registro
export async function buscarGasto(uid: string, id: string): Promise<Gasto | null> {
  const snap = await getDoc(registroRef(uid, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as GastoDados) };
}

// Update
export async function atualizarGasto(
  uid: string,
  id: string,
  dados: GastoDados
): Promise<void> {
  await updateDoc(registroRef(uid, id), dados);
}

// Delete
export async function excluirGasto(uid: string, id: string): Promise<void> {
  await deleteDoc(registroRef(uid, id));
}
