import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Editor } from "@tiptap/react";
import { OptionBtn } from "../btn/OptionBtn";
import { useTranslations } from "next-intl";
import { ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddImageByLink } from "./AddImageByLink";
import { AddImageByImport } from "./AddImageByImport";

interface Props {
  editor: Editor | null;
}

export const AddImage = ({ editor }: Props) => {
  const t = useTranslations("TASK.EDITOR");
  const [isOpen, setIsOpen] = useState(false);

  const addImage = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
        setIsOpen(false);
      }
    },
    [editor]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <OptionBtn hoverText={t("HOVER.IMAGE")}>
          <ImageIcon size={16} />
        </OptionBtn>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("IMAGE.TITLE")}</DialogTitle>
          <DialogDescription>{t("IMAGE.DESC")}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="byLink" className="w-full">
          <TabsList className="gap-2 flex items-center justify-start">
            <TabsTrigger value="byLink">{t("IMAGE.LINK")}</TabsTrigger>
            <TabsTrigger value="uploadImage">{t("IMAGE.UPLOAD")}</TabsTrigger>
          </TabsList>
          <TabsContent value="byLink">
            <AddImageByLink onAddImage={addImage} />
          </TabsContent>
          <TabsContent value="uploadImage">
            <AddImageByImport onAddImage={addImage} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
